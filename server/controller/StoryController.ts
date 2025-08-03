import { Router } from 'express';
const router = Router();
import { createStory, getStories, getStory } from '../service/StoryService';
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
    // const userId = req.user!.id;
    const newId = await createStory(req.body);
    res.status(201).json({ id: newId });
  } catch (error) {
    next(error);
  }
});

export default router;
