import { Router } from 'express';
import {
  getClasses,
  getSelectableFeatureListById,
} from '../service/ClassService';
import { ClassClassification } from '@prisma/client';
const router = Router();

router.get('/class', async (req, res, next) => {
  try {
    const classification = req.query.classification as
      | ClassClassification
      | undefined;
    const classes = await getClasses(classification);
    res.json(classes);
  } catch (error) {
    next(error);
  }
});

router.get('/class/selectableFeatureList/:id', async (req, res, next) => {
  try {
    const list = await getSelectableFeatureListById(
      parseInt(req.params.id as string)
    );
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.get('/class/:id/level/:level', async (req, res, next) => {
  // try {
  //   const { id, level } = req.params;
  //   const level = await getLevel(id, level);
  //   res.json(level);
  // } catch (error) {
  //   next(error);
  // }
});

export default router;
