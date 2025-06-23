import { Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { getCreature, createCreature } from '../service/CreatureService';

router.get('/test', (req, res) => {
  res.json({ message: 'Test route works! So does the auto build' });
});

// Endpoint to get a creature by id
router.get('/creature/:id', async (req, res, next) => {
  try {
    const creature = await getCreature(parseInt(req.params.id));
    res.json(creature);
  } catch (error) {
    next(error);
  }
});

router.post('/creature', async (req, res, next) => {
  try {
    const newId = await createCreature(req.body);
    res.status(201).json({ id: newId });
  } catch (error) {
    next(error);
  }
});

export default router;
