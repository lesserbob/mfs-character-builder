import { Router } from 'express';
import {
  authenticateToken,
  AuthenticatedRequest,
} from '../service/AuthService';
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

router.get(
  '/creature',
  authenticateToken as any,
  async (req: any, res, next) => {
    try {
      const userId = req.user!.id;
      const creatures = await getCreatures(userId);
      res.json(creatures);
    } catch (error) {
      next(error);
    }
  }
);

// Protected endpoints (authentication required)
router.put(
  '/creature/:id',
  authenticateToken as any,
  async (req: any, res, next) => {
    try {
      const updatedCreature = await updateCreature(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedCreature);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Creates a new creature
 */
router.post(
  '/creature',
  authenticateToken as any,
  async (req: any, res, next) => {
    try {
      const userId = req.user!.id;
      const newId = await createCreature(req.body, userId);
      res.status(201).json({ id: newId });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
