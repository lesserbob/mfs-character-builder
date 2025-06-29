import { Router } from 'express';
const router = Router();
import {
  getCreature,
  getCreatures,
  createCreature,
  updateCreature,
} from '../service/CreatureService';

router.get('/test', (req, res) => {
  res.json({ message: 'Test route works! So does the auto build' });
});

// Public GET endpoints (no authentication required)
router.get('/creature/:id', async (req, res, next) => {
  try {
    const creature = await getCreature(parseInt(req.params.id));
    res.json(creature);
  } catch (error) {
    next(error);
  }
});

router.get('/creature', async (req, res, next) => {
  try {
    const creatures = await getCreatures();
    res.json(creatures);
  } catch (error) {
    next(error);
  }
});

// Protected endpoints (authentication required)
router.put('/creature/:id', async (req, res, next) => {
  try {
    const updatedCreature = await updateCreature(
      parseInt(req.params.id),
      req.body
    );
    res.json(updatedCreature);
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
