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

import { EventsRt } from './events-rt.constants';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/events',
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private readonly connectedUsers = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.logger.log('EventsGateway initialized');

    this.eventEmitter.on(EventsRt.EventCreated, ({ event }) => {
      this.server.to('events').emit(EventsRt.EventCreated, {
        event,
        timestamp: new Date().toISOString(),
      });
    });

    this.eventEmitter.on(
      EventsRt.RegistrationUpdated,
      ({ eventId, payload }) => {
        this.server.to(`event:${eventId}`).emit(EventsRt.RegistrationUpdated, {
          eventId,
          payload,
          timestamp: new Date().toISOString(),
        });
      }
    );

    this.eventEmitter.on(EventsRt.EventUpdated, ({ event }) => {
      const eventId = event.id;
      this.server.to(`event:${eventId}`).emit(EventsRt.EventUpdated, {
        event,
        timestamp: new Date().toISOString(),
      });
    });

    this.eventEmitter.on(EventsRt.EventDeleted, ({ eventId }) => {
      this.server.to(`event:${eventId}`).emit(EventsRt.EventDeleted, {
        eventId,
        timestamp: new Date().toISOString(),
      });
    });
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
    }
  }

  @SubscribeMessage('join-event')
  async joinEvent(client: AuthenticatedSocket, data: { eventId: string }) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }
    await client.join(`event:${data.eventId}`);
    return { success: true };
  }

  @SubscribeMessage('leave-event')
  async leaveEvent(client: AuthenticatedSocket, data: { eventId: string }) {
    if (!client.userId) {
      return { error: 'Not authenticated' };
    }
    await client.leave(`event:${data.eventId}`);
    return { success: true };
  }
}
