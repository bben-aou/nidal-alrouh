import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatRoomType, Message } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

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
    // Ensure sender is a participant
    const participant = await this.prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId, userId: senderId } },
    });
    if (!participant) {
      throw new ForbiddenException('Not a participant of this room');
    }

    // Ensure room exists
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

    // Mark sender as read up to now
    await this.prisma.roomParticipant.update({
      where: { roomId_userId: { roomId, userId: senderId } },
      data: { lastReadAt: new Date() },
    });

    // Emit to socket clients
    const enriched = mapMessageForViewer(message, undefined, senderId);
    const gateway = ChatGateway.getInstance();
    if (gateway) {
      // Broadcast as delivered by default; viewer-specific read state will be handled by list API
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
    });
    if (!room) throw new NotFoundException('Room not found');

    const viewerParticipant = await this.prisma.roomParticipant.findUnique({
      where: { roomId_userId: { roomId, userId: currentUserId } },
    });

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
      mapMessageForViewer(m, lastReadAt, currentUserId)
    );
  }

  async markRead(roomId: string, userId: string) {
    await this.prisma.roomParticipant.update({
      where: { roomId_userId: { roomId, userId } },
      data: { lastReadAt: new Date() },
    });

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
  viewerId: string
) {
  const isOwn = message.senderId === viewerId;
  const readByViewer =
    !!viewerLastReadAt && message.createdAt <= viewerLastReadAt;
  const status: 'sent' | 'delivered' | 'read' = isOwn
    ? 'sent'
    : readByViewer
      ? 'read'
      : 'delivered';

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
