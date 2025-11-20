'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuth } from '@/contexts/auth-context';
import { getWsBaseUrl, EVENTS_NAMESPACE } from '@/lib/ws';

interface EventsSocketContextValue {
  socket: Socket | null;
}

const EventsSocketContext = createContext<EventsSocketContextValue>({
  socket: null,
});

export function EventsSocketProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const url = useMemo(() => `${getWsBaseUrl()}${EVENTS_NAMESPACE}`, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = io(url, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    setSocket(s);

    s.on('connect_error', () => {});

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [url, isAuthenticated]);

  return (
    <EventsSocketContext.Provider value={{ socket }}>
      {children}
    </EventsSocketContext.Provider>
  );
}

export function useEventsSocket() {
  return useContext(EventsSocketContext);
}
