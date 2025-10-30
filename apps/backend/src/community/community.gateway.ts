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
  namespace: '/community',
})
export class CommunityGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(CommunityGateway.name);
  private readonly connectedUsers = new Map<string, string>();

  // Static instance for service access
  private static instance: CommunityGateway;

  constructor(private readonly jwtService: JwtService) {
    CommunityGateway.instance = this;
  }

  static getInstance(): CommunityGateway | null {
    return CommunityGateway.instance || null;
  }

  onModuleInit() {
    this.logger.log('CommunityGateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const tokenLocation = extractTokenFromSocket(client);

      if (!tokenLocation) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      this.logger.debug(
        `Client ${client.id} authenticated using token from ${tokenLocation.source}`
      );

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(tokenLocation.value);
      const userId = payload.sub as string;
      client.userId = userId;

      // Store connection
      this.connectedUsers.set(client.id, userId);

      this.logger.log(`User ${userId} connected with socket ${client.id}`);

      // Join user to their personal room for targeted notifications
      await client.join(`user:${userId}`);
    } catch (error: any) {
      this.logger.error(
        `Authentication failed for client ${client.id}: ${error?.message || 'Unknown error'}`
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

  /**
   * Join a post room to receive real-time updates for that post
   */
  @SubscribeMessage('join-post')
  async handleJoinPost(client: AuthenticatedSocket, data: { postId: string }) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    await client.join(`post:${data.postId}`);
    this.logger.log(`User ${client.userId} joined post room: ${data.postId}`);

    return { success: true, message: `Joined post ${data.postId}` };
  }

  /**
   * Leave a post room
   */
  @SubscribeMessage('leave-post')
  async handleLeavePost(client: AuthenticatedSocket, data: { postId: string }) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    await client.leave(`post:${data.postId}`);
    this.logger.log(`User ${client.userId} left post room: ${data.postId}`);

    return { success: true, message: `Left post ${data.postId}` };
  }

  /**
   * Emit when a new comment is created
   */
  emitCommentCreated(postId: string, comment: any) {
    this.server.to(`post:${postId}`).emit('comment.created', {
      postId,
      comment,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted comment.created for post ${postId}`);
  }

  /**
   * Emit when a post is liked
   */
  emitPostLiked(postId: string, userId: string, likeCount: number) {
    this.server.to(`post:${postId}`).emit('post.liked', {
      postId,
      userId,
      likeCount,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.liked for post ${postId} by user ${userId}`);
  }

  /**
   * Emit when a post is unliked
   */
  emitPostUnliked(postId: string, userId: string, likeCount: number) {
    this.server.to(`post:${postId}`).emit('post.unliked', {
      postId,
      userId,
      likeCount,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted post.unliked for post ${postId} by user ${userId}`
    );
  }

  /**
   * Emit when a post is hidden for a specific user
   */
  emitPostHidden(userId: string, postId: string) {
    this.server.to(`user:${userId}`).emit('post.hidden', {
      postId,
      userId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.hidden for post ${postId} to user ${userId}`);
  }

  /**
   * Emit when a post is unhidden for a specific user
   */
  emitPostUnhidden(userId: string, postId: string) {
    this.server.to(`user:${userId}`).emit('post.unhidden', {
      postId,
      userId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted post.unhidden for post ${postId} to user ${userId}`
    );
  }

  /**
   * Emit when a post is reported
   */
  emitPostReported(postId: string, report: unknown) {
    this.server.to(`post:${postId}`).emit('post.reported', {
      postId,
      report,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.reported for post ${postId}`);
  }

  /**
   * Emit when a new post is created (to all connected users)
   */
  emitPostCreated(post: any) {
    this.server.emit('post.created', {
      post,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.created for post ${post.id}`);
  }

  /**
   * Emit when a post is updated
   */
  emitPostUpdated(postId: string, post: any) {
    this.server.to(`post:${postId}`).emit('post.updated', {
      postId,
      post,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.updated for post ${postId}`);
  }

  /**
   * Emit when a post is deleted
   */
  emitPostDeleted(postId: string) {
    this.server.to(`post:${postId}`).emit('post.deleted', {
      postId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.deleted for post ${postId}`);
  }

  /**
   * Send a notification to a specific user
   */
  emitUserNotification(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted notification to user ${userId}`);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Check if a user is connected
   */
  isUserConnected(userId: string): boolean {
    return Array.from(this.connectedUsers.values()).includes(userId);
  }
}
