import express from 'express';
import { Goal } from '../models/Goal';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all goals for a user
router.get('/', auth, async (req: any, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    return res.json(goals);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching goals' });
  }
});

// Create a new goal
router.post('/', auth, async (req: any, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user._id,
    });
    await goal.save();
    return res.status(201).json(goal);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating goal' });
  }
});

// Update a goal
router.patch('/:id', auth, async (req: any, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'progress', 'target', 'unit', 'category'] as const;
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update as typeof allowedUpdates[number]));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    updates.forEach((update) => {
      const key = update as keyof typeof goal;
      if (key in goal) {
        (goal as any)[key] = req.body[key];
      }
    });
    
    await goal.save();
    return res.json(goal);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating goal' });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    return res.json(goal);
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting goal' });
  }
});

export default router; 