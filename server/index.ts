const express = require('express');
import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import cors from 'cors';
import creatureController from './controller/CreatureController';
import classController from './controller/ClassController';

const app = express();
const port = 3001;

// Configure CORS with specific options
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow your frontend URLs
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
