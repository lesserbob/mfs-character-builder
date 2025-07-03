import { Router } from 'express';
import { authenticateToken, generateToken } from '../middleware/auth';
import {
  getUserByUsername,
  createUser,
  getUserById,
} from '../service/UserService';
import bcrypt from 'bcryptjs';

const router = Router();

// Register endpoint
router.post('/register', async (req: any, res: any, next: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  if (await getUserByUsername(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const user = await createUser(username, password);

  const token = generateToken(user.id, user.username);

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
});

// Login endpoint
router.post('/login', async (req: any, res: any, next: any) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.username);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user endpoint (requires authentication)
router.get(
  '/me',
  authenticateToken as any,
  async (req: any, res: any, next: any) => {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  }
);

export default router;
