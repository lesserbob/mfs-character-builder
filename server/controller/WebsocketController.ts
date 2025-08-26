/**
 * Handles websocket setup and functionality
 */

import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from '../service/AuthService';

interface Message {
  type: string;
  payload?: any;
}

// Store connected clients if you need to broadcast
const clients = new Set<WebSocket>();

export function createWebSocketController(server: any) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const params = new URL(req.url!, `https://${req.headers.host}`)
      .searchParams;
    const token = params.get('token');

    if (!token) {
      console.log('Access token required');
      ws.close();
      return;
    }

    const user = verifyToken(token);
    if (!user) {
      console.log('Invalid or expired token');
      ws.close();
      return;
    }

    clients.add(ws);

    ws.on('message', (rawMessage) => {
      try {
        const msg: Message = JSON.parse(rawMessage.toString());
        handleMessage(ws, msg);
      } catch (err) {
        console.error('Invalid WS message:', rawMessage.toString());
      }
    });

    ws.on('open', () => {
      console.log('New socket opened');
    });

    ws.on('close', () => {
      console.log('WS client disconnected');
      clients.delete(ws);
    });

    // Optional: send a welcome message
    ws.send(
      JSON.stringify({
        type: 'welcome',
        payload: 'Websocket server connection complete',
      })
    );
  });

  return wss;
}

function handleMessage(ws: WebSocket, msg: Message) {
  switch (msg.type) {
    // TODO What now
    case 'refresh_location':
      broadcast({ type: 'refresh_location', payload: msg.payload });
      break;
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', payload: Date.now() }));
      break;
    case 'chat':
      broadcast({ type: 'chat', payload: msg.payload });
      break;
    default:
      console.warn('Unknown message type:', msg.type);
      ws.send(
        JSON.stringify({ type: 'error', payload: 'Unknown message type' })
      );
  }
}

function broadcast(message: Message) {
  const json = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  }
}
