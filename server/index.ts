const express = require('express');
import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import cors from 'cors';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import path from 'path';
import creatureController from './controller/CreatureController';
import classController from './controller/ClassController';
import authController from './controller/AuthController';
import itemController from './controller/ItemController';
import storyController from './controller/StoryController';
import { authenticateToken } from './service/AuthService';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const httpsPort = 3443;

// Security middleware
app.use(helmet());

// Configure CORS with specific options
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:5173',
      'https://localhost:3000',
    ];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Serve static files from public/
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => res.send('OK'));

// Open SQLite database
let db: Database;
(async () => {
  db = await open({
    filename: process.env.DB_PATH || './database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Public routes (no authentication required)
app.use('/api/auth', authController);

// Mount controllers (authentication will be added to specific routes)
app.use('/api', creatureController);
app.use('/api', classController);
app.use('/api', itemController);
app.use('/api', storyController);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);

  if (err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// HTTP server (for development and production)
app.listen(port, () => {
  console.log(`HTTP Server listening at http://localhost:${port}`);
});

// HTTPS server (for development and production when SSL is available)
try {
  // In production, EB might provide SSL certificates at a different path
  const sslPath =
    process.env.NODE_ENV === 'production'
      ? '/etc/pki/tls/certs'
      : path.join(process.cwd(), 'ssl');

  const privateKeyPath =
    process.env.NODE_ENV === 'production'
      ? path.join(sslPath, 'private-key.pem')
      : path.join(process.cwd(), 'ssl/private-key.pem');

  const certificatePath =
    process.env.NODE_ENV === 'production'
      ? path.join(sslPath, 'certificate.pem')
      : path.join(process.cwd(), 'ssl/certificate.pem');

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(certificatePath, 'utf8');

  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server listening at https://localhost:${httpsPort}`);
  });
} catch (error) {
  console.log('SSL certificates not found. HTTPS server not started.');
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      'To enable HTTPS in development, create SSL certificates in the ssl/ directory:'
    );
    console.log('  mkdir ssl');
    console.log(
      '  openssl req -x509 -newkey rsa:4096 -keyout ssl/private-key.pem -out ssl/certificate.pem -days 365 -nodes'
    );
  }
}
