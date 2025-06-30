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
import { authenticateToken } from './middleware/auth';

const app = express();
const port = 3001;
const httpsPort = 3443;

// Security middleware
app.use(helmet());

// Configure CORS with specific options
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:5173',
      'https://localhost:3000',
    ], // Allow your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods including OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
    credentials: true, // Allow credentials if needed
  })
);

app.use(express.json());

// Open SQLite database
let db: Database;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Public routes (no authentication required)
app.use('/api/auth', authController);

// Mount controllers (authentication will be added to specific routes)
app.use('/api', creatureController);
app.use('/api', classController);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);

  if (err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// HTTP server (for development)
app.listen(port, () => {
  console.log(`HTTP Server listening at http://localhost:${port}`);
});

// HTTPS server (for production)
try {
  const privateKey = fs.readFileSync(
    path.join(process.cwd(), 'ssl/private-key.pem'),
    'utf8'
  );
  const certificate = fs.readFileSync(
    path.join(process.cwd(), 'ssl/certificate.pem'),
    'utf8'
  );

  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server listening at https://localhost:${httpsPort}`);
  });
} catch (error) {
  console.log('SSL certificates not found. HTTPS server not started.');
  console.log(
    'To enable HTTPS, create SSL certificates in the ssl/ directory:'
  );
  console.log('  mkdir ssl');
  console.log(
    '  openssl req -x509 -newkey rsa:4096 -keyout ssl/private-key.pem -out ssl/certificate.pem -days 365 -nodes'
  );
}
