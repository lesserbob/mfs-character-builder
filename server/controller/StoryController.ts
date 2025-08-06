import { Router } from 'express';
const router = Router();
import {
  addActors,
  createLocation,
  createStory,
  getActors,
  getLocation,
  getLocations,
  getStories,
  getStory,
  updateLocation,
} from '../service/StoryService';
import { authenticateToken } from '../service/AuthService';

// Get a single story by id
router.get('/story/:id', async (req, res, next) => {
  try {
    const story = await getStory(parseInt(req.params.id));
    res.json(story);
  } catch (error) {
    next(error);
  }
});

// Search Stories
router.get('/story', async (req, res, next) => {
  try {
    const stories = await getStories();
    res.json(stories);
  } catch (error) {
    next(error);
  }
});

router.post('/story', authenticateToken as any, async (req: any, res, next) => {
  try {
    const newId = await createStory(req.body);
    res.status(201).json({ id: newId });
  } catch (error) {
    next(error);
  }
});

router.get('/story/:storyId/location', async (req, res, next) => {
  try {
    const locations = await getLocations(parseInt(req.params.storyId));
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/story/:storyId/location',
  authenticateToken as any,
  async (req: any, res, next) => {
    try {
      const newId = await createLocation(
        parseInt(req.params.storyId),
        req.body
      );
      res.status(201).json({ id: newId });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/location/:locationId', async (req, res, next) => {
  try {
    const location = await getLocation(parseInt(req.params.locationId));
    res.json(location);
  } catch (error) {
    next(error);
  }
});

router.put('/location/:locationId', async (req, res, next) => {
  try {
    await updateLocation(parseInt(req.params.locationId), req.body);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/story/:storyId/addActorAgent',
  authenticateToken as any,
  async (req: any, res, next) => {
    try {
      await addActors(parseInt(req.params.storyId), req.body);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/story/:storyId/actor', async (req, res, next) => {
  try {
    const actors = await getActors(parseInt(req.params.storyId));
    res.json(actors);
  } catch (error) {
    next(error);
  }
});

export default router;
