import express from 'express';
import { Action } from '../models/Action';
import { auth } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// Get all actions for a user
router.get('/', auth, async (req: any, res) => {
  try {
    const actions = await Action.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);
    return res.json(actions);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching actions' });
  }
});

// Log a new action
router.post('/', auth, async (req: any, res) => {
  try {
    const action = new Action({
      ...req.body,
      user: req.user._id,
    });
    await action.save();
    return res.status(201).json(action);
  } catch (error) {
    return res.status(400).json({ message: 'Error logging action' });
  }
});

// Get action statistics
router.get('/stats', auth, async (req: any, res) => {
  try {
    const totalActions = await Action.countDocuments({ user: req.user._id });
    const totalPoints = await Action.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);

    const categoryStats = await Action.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          points: { $sum: '$points' },
        },
      },
    ]);

    return res.json({
      totalActions,
      totalPoints: totalPoints[0]?.total || 0,
      categoryStats,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching action statistics' });
  }
});

// Delete an action
router.delete('/:id', auth, async (req: any, res) => {
  try {
    // First find the action to get its points
    const action = await Action.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    // Store points before deleting
    const points = action.points;

    // Delete the action
    await Action.deleteOne({ _id: req.params.id, user: req.user._id });

    // Update user points
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: -points },
    });

    return res.json({ message: 'Action deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting action' });
  }
});

export default router; 