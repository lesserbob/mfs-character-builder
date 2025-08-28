import {
  Box,
  Drawer,
  TextField,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';

// interface LogMessage {
//   id?: number;
//   userName?: string;
//   logMessage?: string;
// }
import SendIcon from '@mui/icons-material/Send';
import { LogMessage } from '../../../api/generated';
import { useWebSocket } from '../../../context/WebSocketContext';

export const GameLog = () => {
  const [logMessages, setLogMessages] = useState<LogMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { isAuthenticated, token } = useAuth();
  const { lastMessage } = useWebSocket();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(() => {
    if (!isAuthenticated || !token) {
      console.log('Not authenticated, skipping fetch');
      return;
    }

    return apiClient
      .getLogMessages()
      .then((response) => {
        setLogMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching log messages:', error);
      });
  }, [isAuthenticated, token]);

  const handleSendMessage = () => {
    if (!isAuthenticated || !token) {
      console.error('Not authenticated, cannot send message');
      return;
    }

    if (newMessage.trim()) {
      apiClient
        .postLogMessage({ logMessage: newMessage })
        .then(() => {
          setNewMessage('');
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMessages();
    }
  }, [fetchMessages, isAuthenticated, token]);

  useEffect(() => {
    if (!lastMessage) return;
    if (!isAuthenticated) return;
    if (!token) return;

    if (lastMessage.type === 'refresh_logs') {
      fetchMessages();
    }
  }, [lastMessage, isAuthenticated, token]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logMessages]); // scrolls whenever messages change

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      className="game-log-panel-drawer"
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h6" component="div">
            Game Log
          </Typography>
        </Box>

        {/* Messages Area */}
        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: 'grey.50',
          }}
        >
          {logMessages && logMessages.length > 0 ? (
            logMessages.map((message, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  backgroundColor: 'white',
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {message.userName && `${message.userName} - `}
                </Typography>
                <Typography variant="body1">{message.logMessage}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No messages yet
            </Typography>
          )}
        </Box>

        {/* Input Area - Locked to Bottom */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              color="primary"
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
