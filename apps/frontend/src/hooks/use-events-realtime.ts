'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { GET_EVENT_BY_ID_KEY } from '@/apis/events/queries/use-get-event-by-id';
import { GET_EVENTS_KEY } from '@/apis/events/queries/use-get-events';
import { useEventsSocket } from '@/contexts/events-socket-context';
import { EventRegistrationUpdatedMessage } from '@/types/community';

export function useEventsRealtime(eventIds: string[] = []) {
  const { socket } = useEventsSocket();
  const qc = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    eventIds.forEach((id) => socket.emit('join-event', { eventId: id }));

    const onRegistrationUpdated = (msg: EventRegistrationUpdatedMessage) => {
      qc.invalidateQueries({ queryKey: [GET_EVENTS_KEY] });
      qc.invalidateQueries({ queryKey: [GET_EVENT_BY_ID_KEY, msg.eventId] });
    };

    const onEventCreated = () => {
      qc.invalidateQueries({ queryKey: [GET_EVENTS_KEY] });
    };

    const onEventUpdated = (msg: { event: { id: string } }) => {
      qc.invalidateQueries({ queryKey: [GET_EVENTS_KEY] });
      if (msg.event?.id) {
        qc.invalidateQueries({ queryKey: [GET_EVENT_BY_ID_KEY, msg.event.id] });
      }
    };

    const onEventDeleted = (msg: { eventId: string }) => {
      qc.invalidateQueries({ queryKey: [GET_EVENTS_KEY] });
      if (msg.eventId) {
        qc.invalidateQueries({ queryKey: [GET_EVENT_BY_ID_KEY, msg.eventId] });
      }
    };

    socket.on('events.event.registration.updated', onRegistrationUpdated);
    socket.on('events.event.created', onEventCreated);
    socket.on('events.event.updated', onEventUpdated);
    socket.on('events.event.deleted', onEventDeleted);

    return () => {
      socket.off('events.event.registration.updated', onRegistrationUpdated);
      socket.off('events.event.created', onEventCreated);
      socket.off('events.event.updated', onEventUpdated);
      socket.off('events.event.deleted', onEventDeleted);
      eventIds.forEach((id) => socket.emit('leave-event', { eventId: id }));
    };
  }, [socket, qc, eventIds.join('|')]);
}
