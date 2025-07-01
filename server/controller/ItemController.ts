import { Router } from 'express';
const router = Router();
import { getItems } from '../service/ItemService';

router.get('/item', async (req, res, next) => {
  try {
    const items = await getItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

export default router;
