import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventsRt } from './events-rt.constants';

@Injectable()
export class EventsRealtimeService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitEventCreated(event: unknown) {
    this.eventEmitter.emit(EventsRt.EventCreated, { event });
  }

  emitRegistrationUpdated(eventId: string, payload: unknown) {
    this.eventEmitter.emit(EventsRt.RegistrationUpdated, { eventId, payload });
  }
}
