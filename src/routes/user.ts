import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        points: user.points,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        points: user.points,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error logging in' });
  }
});

// Get user profile
router.get('/profile', auth, async (req: any, res) => {
  try {
    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        level: req.user.level,
        points: req.user.points,
        achievements: req.user.achievements,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req: any, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'] as const;
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update as typeof allowedUpdates[number]));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach((update) => {
      const key = update as keyof typeof req.user;
      if (key in req.user) {
        (req.user as any)[key] = req.body[key];
      }
    });
    await req.user.save();
    return res.json(req.user);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating profile' });
  }
});

export default router; 