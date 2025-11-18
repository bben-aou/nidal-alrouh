import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { extractTokenFromSocket } from '../common/utils/token.utils';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly connectedUsers = new Map<string, string>();

  // Static instance for service access
  private static instance: ChatGateway;

  constructor(private readonly jwtService: JwtService) {
    ChatGateway.instance = this;
  }

  static getInstance(): ChatGateway | null {
    return ChatGateway.instance || null;
  }

  onModuleInit() {
    this.logger.log('ChatGateway initialized');
  }

  private roomName(roomId: string): string {
    return `chat:room:${roomId}`;
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const tokenLocation = extractTokenFromSocket(client);

      if (!tokenLocation) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(tokenLocation.value);
      const userId = payload.sub as string;
      client.userId = userId;

      this.connectedUsers.set(client.id, userId);
      await client.join(`user:${userId}`);

      this.logger.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Authentication failed for client ${client.id}: ${errorMessage}`
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.logger.log(`User ${userId} disconnected (socket ${client.id})`);
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(client: AuthenticatedSocket, data: { roomId: string }) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    await client.join(this.roomName(data.roomId));
    this.logger.log(`User ${client.userId} joined chat room: ${data.roomId}`);
    return { success: true };
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(client: AuthenticatedSocket, data: { roomId: string }) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }
    await client.leave(this.roomName(data.roomId));
    this.logger.log(`User ${client.userId} left chat room: ${data.roomId}`);
    return { success: true };
  }

  emitMessageCreated(roomId: string, message: any) {
    const timestamp = new Date().toISOString();
    this.server.to(this.roomName(roomId)).emit('chat:message:created', {
      roomId,
      message,
      timestamp,
    });
  }

  emitRoomRead(roomId: string, userId: string, lastReadAt: string) {
    const timestamp = new Date().toISOString();
    this.server.to(this.roomName(roomId)).emit('chat:room:read', {
      roomId,
      userId,
      lastReadAt,
      timestamp,
    });
  }
}
