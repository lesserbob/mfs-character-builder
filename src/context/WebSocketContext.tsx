import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

/**
 * Exists to handle web socket communications and expose to rest of app
 */
type WSMessage = { type: string; payload?: any };

const WEBSOCKET_BASE_URL = `wss://${window.location.hostname}:3443/ws`;

type WebSocketContextType = {
  socket: WebSocket | null;
  sendMessage: (msg: WSMessage) => void;
  lastMessage: WSMessage | null;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const { token } = useAuth();
  useEffect(() => {
    // Got to have a token
    if (!token) return;

    // TODO: This really should be from config...
    const ws = new WebSocket(WEBSOCKET_BASE_URL + `?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => console.log('Connected to WebSocket server');

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        setLastMessage(msg);
      } catch {
        console.error('Invalid message', event.data);
      }
    };

    // ws.onclose = () => console.log('WebSocket connection closed');
    ws.onerror = (err) => console.error('WebSocket error', err);

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [token]);

  const sendMessage = (msg: WSMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, sendMessage, lastMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  return context;
};
