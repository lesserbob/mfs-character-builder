import { Router } from 'express';
import {
  authenticateToken,
  AuthenticatedRequest,
} from '../service/AuthService';
import { addLog, getGameLogs } from '../service/GameLogService';
const router = Router();

router.post(
  '/gameLog',
  authenticateToken as any,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      addLog(req.user!, req.body);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/gameLog',
  authenticateToken as any,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const logs = await getGameLogs(req.user!);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
