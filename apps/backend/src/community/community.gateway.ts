import { Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { PostReport } from '@prisma/client';
import { Server, Socket } from 'socket.io';

import { extractTokenFromSocket } from '../common/utils/token.utils';

import { SanitizedPost, SanitizedComment } from './community-events.service';
import { CommunityEvent } from './constants/events.constants';
import { Notification } from './types';

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

  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) {
    CommunityGateway.instance = this;
  }

  static getInstance(): CommunityGateway | null {
    return CommunityGateway.instance || null;
  }

  onModuleInit() {
    this.logger.log('CommunityGateway initialized');

    // Subscribe to domain events and forward them to socket clients
    this.eventEmitter.on(
      CommunityEvent.PostCreated,
      ({ post }: { post: SanitizedPost }) => {
        this.emitPostCreated(post);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostUpdated,
      ({ postId, post }: { postId: string; post: SanitizedPost }) => {
        this.emitPostUpdated(postId, post);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostDeleted,
      ({ postId }: { postId: string }) => {
        this.emitPostDeleted(postId);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostLiked,
      ({
        postId,
        userId,
        likeCount,
      }: {
        postId: string;
        userId: string;
        likeCount: number;
      }) => {
        this.emitPostLiked(postId, userId, likeCount);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostUnliked,
      ({
        postId,
        userId,
        likeCount,
      }: {
        postId: string;
        userId: string;
        likeCount: number;
      }) => {
        this.emitPostUnliked(postId, userId, likeCount);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.CommentCreated,
      ({
        postId,
        comment,
        authorUserId,
      }: {
        postId: string;
        comment: SanitizedComment;
        authorUserId: string;
      }) => {
        this.emitCommentCreated(postId, comment, authorUserId);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.CommentDeleted,
      ({ postId, commentId }: { postId: string; commentId: string }) => {
        this.emitCommentDeleted(postId, commentId);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostHidden,
      ({ userId, postId }: { userId: string; postId: string }) => {
        this.emitPostHidden(userId, postId);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostUnhidden,
      ({ userId, postId }: { userId: string; postId: string }) => {
        this.emitPostUnhidden(userId, postId);
      }
    );

    this.eventEmitter.on(
      CommunityEvent.PostReported,
      ({ postId, report }: { postId: string; report: PostReport }) => {
        this.emitPostReported(postId, report);
      }
    );
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
  emitCommentCreated(
    postId: string,
    comment: SanitizedComment,
    authorUserId: string
  ) {
    const timestamp = new Date().toISOString();

    // Emit to the author with isOwner: true
    this.server.to(`user:${authorUserId}`).emit(CommunityEvent.CommentCreated, {
      postId,
      comment: { ...comment, isOwner: true },
      timestamp,
    });

    // Emit to everyone else in the post room with isOwner: false
    this.server
      .to(`post:${postId}`)
      .except(`user:${authorUserId}`)
      .emit(CommunityEvent.CommentCreated, {
        postId,
        comment: { ...comment, isOwner: false },
        timestamp,
      });

    this.logger.log(
      `Emitted comment.created for post ${postId} (owner ${authorUserId})`
    );
  }

  /**
   * Emit when a comment is deleted
   */
  emitCommentDeleted(postId: string, commentId: string) {
    this.server.to(`post:${postId}`).emit(CommunityEvent.CommentDeleted, {
      postId,
      commentId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted comment.deleted for comment ${commentId} in post ${postId}`
    );
  }

  /**
   * Emit when a post is liked
   */
  emitPostLiked(postId: string, userId: string, likeCount: number) {
    this.server.to(`post:${postId}`).emit(CommunityEvent.PostLiked, {
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
    this.server.to(`post:${postId}`).emit(CommunityEvent.PostUnliked, {
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
    this.server.to(`user:${userId}`).emit(CommunityEvent.PostHidden, {
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
    this.server.to(`user:${userId}`).emit(CommunityEvent.PostUnhidden, {
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
  emitPostReported(postId: string, report: PostReport) {
    this.server.to(`post:${postId}`).emit(CommunityEvent.PostReported, {
      postId,
      report,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.reported for post ${postId}`);
  }

  /**
   * Emit when a new post is created (to all connected users)
   */
  emitPostCreated(post: SanitizedPost) {
    this.server.emit(CommunityEvent.PostCreated, {
      post,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.created for post ${post.id}`);
  }

  /**
   * Emit when a post is updated
   */
  emitPostUpdated(postId: string, post: SanitizedPost) {
    this.server.to(`post:${postId}`).emit(CommunityEvent.PostUpdated, {
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
    this.server.to(`post:${postId}`).emit(CommunityEvent.PostDeleted, {
      postId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted post.deleted for post ${postId}`);
  }

  /**
   * Send a notification to a specific user
   */
  emitUserNotification(userId: string, notification: Notification) {
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
