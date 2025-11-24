'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { useAuth } from '@/contexts/auth-context';
import {
  getWsBaseUrl,
  COMMUNITY_NAMESPACE,
  RESOURCES_NAMESPACE,
} from '@/lib/ws';

interface SocketContextType {
  socket: Socket | null;
  resourcesSocket: Socket | null;
  isConnected: boolean;
  isResourcesConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  resourcesSocket: null,
  isConnected: false,
  isResourcesConnected: false,
});

export function useSocket() {
  const context = useContext(SocketContext);
  return context.socket;
}

export function useResourcesSocket() {
  const context = useContext(SocketContext);
  return context.resourcesSocket;
}

export function useSocketConnection() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: Readonly<SocketProviderProps>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [resourcesSocket, setResourcesSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isResourcesConnected, setIsResourcesConnected] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const endpoint = `${getWsBaseUrl()}${COMMUNITY_NAMESPACE}`;

    const newSocket = io(endpoint, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[community socket] disconnected ❌ ');
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  // Resources socket connection
  useEffect(() => {
    if (!isAuthenticated) {
      if (resourcesSocket) {
        resourcesSocket.disconnect();
        setResourcesSocket(null);
        setIsResourcesConnected(false);
      }
      return;
    }

    const endpoint = `${getWsBaseUrl()}${RESOURCES_NAMESPACE}`;

    const newSocket = io(endpoint, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[resources socket] connected ✅ ');
      setIsResourcesConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[resources socket] disconnected ❌ ');
      setIsResourcesConnected(false);
    });

    newSocket.on('connect_error', () => {
      setIsResourcesConnected(false);
    });

    setResourcesSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setResourcesSocket(null);
      setIsResourcesConnected(false);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{ socket, resourcesSocket, isConnected, isResourcesConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}
