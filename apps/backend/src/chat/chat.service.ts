import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ChatRoomType, Message } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(ChatService.name);
  async resolveUserIdByUsername(username: string): Promise<string> {
    const trimmed = username.trim();
    if (!trimmed) throw new BadRequestException('Username required');

    // Try HelperProfile.calUsername first
    const helper = await this.prisma.helperProfile.findFirst({
      where: { calUsername: trimmed },
      include: { user: { select: { id: true } } },
    });
    if (helper?.user?.id) return helper.user.id;

    // Fallback to User.name exact match (case-insensitive)
    const users = await this.prisma.user.findMany({
      where: { name: { equals: trimmed, mode: 'insensitive' } },
      select: { id: true },
      take: 2,
    });
    if (users.length === 0) throw new NotFoundException('User not found');
    if (users.length > 1)
      throw new BadRequestException('Multiple users match this username');
    return users[0].id;
  }
  async findOrCreateDmRoom(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId) {
      throw new ForbiddenException('Cannot create a DM with yourself');
    }

    const existing = await this.prisma.chatRoom.findFirst({
      where: {
        type: ChatRoomType.DM,
        AND: [
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId: otherUserId } } },
        ],
      },
      include: { participants: true },
    });

    if (existing) return existing;

    return this.prisma.chatRoom.create({
      data: {
        type: ChatRoomType.DM,
        participants: {
          create: [{ userId: currentUserId }, { userId: otherUserId }],
        },
      },
      include: { participants: true },
    });
  }

  async sendMessage(roomId: string, senderId: string, content: string) {
    const participant = await this.prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId, userId: senderId } },
    });
    if (!participant) {
      throw new ForbiddenException('Not a participant of this room');
    }

    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const message = await this.prisma.message.create({
      data: { roomId, senderId, content },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const senderParticipant = await this.prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId, userId: senderId } },
      select: { lastReadAt: true },
    });

    const otherParticipants = await this.prisma.roomParticipant.findMany({
      where: {
        roomId,
        userId: { not: senderId },
      },
      select: { lastReadAt: true },
    });
    const otherParticipantsLastReadAt = otherParticipants
      .map((p) => p.lastReadAt)
      .filter((date): date is Date => date !== null);

    const enriched = mapMessageForViewer(
      message,
      senderParticipant?.lastReadAt ?? undefined,
      senderId,
      otherParticipantsLastReadAt
    );
    const gateway = ChatGateway.getInstance();
    if (gateway) {
      gateway.emitMessageCreated(roomId, { ...enriched, status: 'delivered' });
    }

    return enriched;
  }

  async listMessages(
    roomId: string,
    currentUserId: string,
    take = 50,
    cursor?: string
  ) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          select: {
            userId: true,
            lastReadAt: true,
          },
        },
      },
    });
    if (!room) throw new NotFoundException('Room not found');

    const viewerParticipant = room.participants.find(
      (p) => p.userId === currentUserId
    );
    if (!viewerParticipant) throw new NotFoundException('User not in room');

    const otherParticipantsLastReadAt = room.participants
      .filter((p) => p.userId !== currentUserId)
      .map((p) => p.lastReadAt)
      .filter((date): date is Date => date !== null);

    const messages = await this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      take,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const lastReadAt: Date | undefined =
      viewerParticipant?.lastReadAt ?? undefined;
    return messages.map((m) =>
      mapMessageForViewer(
        m,
        lastReadAt,
        currentUserId,
        otherParticipantsLastReadAt
      )
    );
  }

  async markRead(roomId: string, userId: string) {
    const now = new Date();
    await this.prisma.roomParticipant.update({
      where: { roomId_userId: { roomId, userId } },
      data: { lastReadAt: now },
    });

    const gateway = ChatGateway.getInstance();
    if (gateway) {
      gateway.emitRoomRead(roomId, userId, now.toISOString());
    }

    return { success: true };
  }

  async listRoomsForUser(currentUserId: string) {
    const rooms = await this.prisma.chatRoom.findMany({
      where: { participants: { some: { userId: currentUserId } } },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = await Promise.all(
      rooms.map(async (room) => {
        const viewerParticipant = room.participants.find(
          (p) => p.userId === currentUserId
        );
        const viewerLastReadAt: Date | undefined =
          viewerParticipant?.lastReadAt ?? undefined;
        const lastMessage = await this.prisma.message.findFirst({
          where: { roomId: room.id },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: { select: { id: true, name: true, avatarUrl: true } },
          },
        });

        const unreadCount = viewerLastReadAt
          ? await this.prisma.message.count({
              where: {
                roomId: room.id,
                createdAt: { gt: viewerLastReadAt },
                senderId: { not: currentUserId },
              },
            })
          : await this.prisma.message.count({
              where: { roomId: room.id, senderId: { not: currentUserId } },
            });

        const participants = room.participants.map((p) => ({
          id: p.user.id,
          name: p.user.name ?? null,
          avatarUrl: p.user.avatarUrl ?? null,
          isOnline: false,
        }));

        const otherParticipant = room.participants.find(
          (p) => p.userId !== currentUserId
        );
        const name =
          room.type === ChatRoomType.DM
            ? (room.name ?? otherParticipant?.user.name ?? 'Direct Message')
            : (room.name ?? 'Group Chat');

        return {
          id: room.id,
          type: room.type,
          name,
          participants,
          lastMessage: lastMessage
            ? mapMessageForViewer(lastMessage, viewerLastReadAt, currentUserId)
            : null,
          unreadCount,
        };
      })
    );

    return enriched;
  }
}

type SenderInfo = {
  id: string;
  name: string | null;
  avatarUrl?: string | null;
};

type MessageWithSender = Message & { sender: SenderInfo };

function mapMessageForViewer(
  message: MessageWithSender,
  viewerLastReadAt: Date | undefined,
  viewerId: string,
  otherParticipantsLastReadAt?: Date[]
) {
  const isOwn = message.senderId === viewerId;
  const readByViewer =
    !!viewerLastReadAt && message.createdAt <= viewerLastReadAt;

  let status: 'sent' | 'delivered' | 'read';

  if (isOwn) {
    if (
      !otherParticipantsLastReadAt ||
      otherParticipantsLastReadAt.length === 0
    ) {
      status = 'sent';
    } else {
      const allRead = otherParticipantsLastReadAt.every(
        (lastReadAt) => !!lastReadAt && message.createdAt <= lastReadAt
      );
      const anyRead = otherParticipantsLastReadAt.some(
        (lastReadAt) => !!lastReadAt && message.createdAt <= lastReadAt
      );

      status = allRead ? 'read' : anyRead ? 'delivered' : 'sent';
    }
  } else {
    status = readByViewer ? 'read' : 'delivered';
  }

  return {
    id: message.id,
    roomId: message.roomId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
    status,
    sender: {
      id: message.sender.id,
      name: message.sender.name ?? null,
      avatarUrl: message.sender.avatarUrl ?? null,
    },
  };
}
