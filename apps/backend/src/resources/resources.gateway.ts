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
import { Server, Socket } from 'socket.io';

import { extractTokenFromSocket } from '../common/utils/token.utils';

import { ResourceEvent } from './constants/events.constants';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/resources',
})
export class ResourcesGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ResourcesGateway.name);
  private readonly connectedUsers = new Map<string, string>();

  private static instance: ResourcesGateway;

  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) {
    ResourcesGateway.instance = this;
  }

  static getInstance(): ResourcesGateway | null {
    return ResourcesGateway.instance || null;
  }

  onModuleInit() {
    this.logger.log('ResourcesGateway initialized');

    this.eventEmitter.on(
      ResourceEvent.ResourceCreated,
      ({ resource }: { resource: any }) => {
        this.emitResourceCreated(resource);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.ResourceUpdated,
      ({ resourceId, resource }: { resourceId: string; resource: any }) => {
        this.emitResourceUpdated(resourceId, resource);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.ResourceDeleted,
      ({ resourceId }: { resourceId: string }) => {
        this.emitResourceDeleted(resourceId);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.ResourceBookmarked,
      ({ userId, resourceId }: { userId: string; resourceId: string }) => {
        this.emitResourceBookmarked(userId, resourceId);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.ResourceUnbookmarked,
      ({ userId, resourceId }: { userId: string; resourceId: string }) => {
        this.emitResourceUnbookmarked(userId, resourceId);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.ResourceViewed,
      ({ userId, resourceId }: { userId: string; resourceId: string }) => {
        this.emitResourceViewed(userId, resourceId);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.ResourceCompleted,
      ({ userId, resourceId }: { userId: string; resourceId: string }) => {
        this.emitResourceCompleted(userId, resourceId);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.BookmarkProgressUpdated,
      ({
        userId,
        resourceId,
        progress,
      }: {
        userId: string;
        resourceId: string;
        progress: number;
      }) => {
        this.emitBookmarkProgressUpdated(userId, resourceId, progress);
      }
    );

    this.eventEmitter.on(
      ResourceEvent.UserStatsUpdated,
      ({ userId }: { userId: string }) => {
        this.emitUserStatsUpdated(userId);
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

      const payload = await this.jwtService.verifyAsync(tokenLocation.value);
      const userId = payload.sub as string;
      client.userId = userId;

      this.connectedUsers.set(client.id, userId);

      this.logger.log(`User ${userId} connected with socket ${client.id}`);

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
   * Join a resource room to receive updates for that specific resource
   */
  @SubscribeMessage('join-resource')
  async handleJoinResource(
    client: AuthenticatedSocket,
    data: { resourceId: string }
  ) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    await client.join(`resource:${data.resourceId}`);
    this.logger.log(
      `User ${client.userId} joined resource room: ${data.resourceId}`
    );

    return { success: true, message: `Joined resource ${data.resourceId}` };
  }

  /**
   * Leave a resource room
   */
  @SubscribeMessage('leave-resource')
  async handleLeaveResource(
    client: AuthenticatedSocket,
    data: { resourceId: string }
  ) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }

    await client.leave(`resource:${data.resourceId}`);
    this.logger.log(
      `User ${client.userId} left resource room: ${data.resourceId}`
    );

    return { success: true, message: `Left resource ${data.resourceId}` };
  }

  emitResourceCreated(resource: any) {
    this.server.emit(ResourceEvent.ResourceCreated, {
      resource,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted resource.created for resource ${resource.id}`);
  }

  emitResourceUpdated(resourceId: string, resource: any) {
    this.server
      .to(`resource:${resourceId}`)
      .emit(ResourceEvent.ResourceUpdated, {
        resourceId,
        resource,
        timestamp: new Date().toISOString(),
      });

    this.logger.log(`Emitted resource.updated for resource ${resourceId}`);
  }

  emitResourceDeleted(resourceId: string) {
    this.server
      .to(`resource:${resourceId}`)
      .emit(ResourceEvent.ResourceDeleted, {
        resourceId,
        timestamp: new Date().toISOString(),
      });

    this.logger.log(`Emitted resource.deleted for resource ${resourceId}`);
  }

  emitResourceBookmarked(userId: string, resourceId: string) {
    this.server.to(`user:${userId}`).emit(ResourceEvent.ResourceBookmarked, {
      userId,
      resourceId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted resource.bookmarked for user ${userId}, resource ${resourceId}`
    );
  }

  emitResourceUnbookmarked(userId: string, resourceId: string) {
    this.server.to(`user:${userId}`).emit(ResourceEvent.ResourceUnbookmarked, {
      userId,
      resourceId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted resource.unbookmarked for user ${userId}, resource ${resourceId}`
    );
  }

  emitResourceViewed(userId: string, resourceId: string) {
    this.server.to(`user:${userId}`).emit(ResourceEvent.ResourceViewed, {
      userId,
      resourceId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted resource.viewed for user ${userId}, resource ${resourceId}`
    );
  }

  emitResourceCompleted(userId: string, resourceId: string) {
    this.server.to(`user:${userId}`).emit(ResourceEvent.ResourceCompleted, {
      userId,
      resourceId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Emitted resource.completed for user ${userId}, resource ${resourceId}`
    );
  }

  emitBookmarkProgressUpdated(
    userId: string,
    resourceId: string,
    progress: number
  ) {
    this.server
      .to(`user:${userId}`)
      .emit(ResourceEvent.BookmarkProgressUpdated, {
        userId,
        resourceId,
        progress,
        timestamp: new Date().toISOString(),
      });

    this.logger.log(
      `Emitted bookmark.progress.updated for user ${userId}, resource ${resourceId}`
    );
  }

  emitUserStatsUpdated(userId: string) {
    this.server.to(`user:${userId}`).emit(ResourceEvent.UserStatsUpdated, {
      userId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Emitted user.stats.updated for user ${userId}`);
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
