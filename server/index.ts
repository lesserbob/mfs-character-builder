const express = require('express');
import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import creatureController from './controller/CreatureController';

const app = express();
const port = 3001;

app.use(express.json());

// Open SQLite database
let db: Database;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
})();

app.use('/api', creatureController);

// // Sample controller: get all items
// app.get('/api/character', async (req: Request, res: Response) => {
//   const items = await db.all('SELECT * FROM items');
//   res.json(items);
// });

// // Sample controller: add an item
// app.post('/api/items', async (req: Request, res: Response) => {
//   const { name } = req.body;
//   const result = await db.run('INSERT INTO items (name) VALUES (?)', name);
//   res.json({ id: (result as any).lastID, name });
// });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 