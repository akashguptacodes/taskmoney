const express = require('express');
const User = require('../models/User');
const PointClaim = require('../models/PointClaim');
const auth = require('../middleware/auth');

const router = express.Router();

// Claim points for a user
router.post('/claim', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate random points between 1-10
    const points = Math.floor(Math.random() * 10) + 1;

    // Create point claim record
    const pointClaim = new PointClaim({
      userId: targetUser._id,
      points,
      claimedBy: req.user._id,
      description: `Points claimed by ${req.user.name}`
    });

    await pointClaim.save();

    // Update user's total points
    await User.findByIdAndUpdate(
      targetUser._id,
      { $inc: { totalPoints: points } }
    );

    // Get updated user data
    const updatedUser = await User.findById(targetUser._id)
      .select('name totalPoints');

    res.json({
      message: 'Points claimed successfully',
      claim: {
        id: pointClaim._id,
        points,
        userName: updatedUser.name,
        claimedBy: req.user.name,
        timestamp: pointClaim.createdAt
      },
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        points: updatedUser.totalPoints
      }
    });
  } catch (error) {
    console.error('Claim points error:', error);
    res.status(500).json({ error: 'Server error while claiming points' });
  }
});

// Get point history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const pointClaims = await PointClaim.find()
      .populate('userId', 'name')
      .populate('claimedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await PointClaim.countDocuments();

    res.json({
      history: pointClaims.map(claim => ({
        id: claim._id,
        userName: claim.userId.name,
        points: claim.points,
        claimedBy: claim.claimedBy.name,
        timestamp: claim.createdAt,
        description: claim.description
      })),
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + pointClaims.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error while fetching history' });
  }
});

// Get user's point history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const pointClaims = await PointClaim.find({ userId })
      .populate('claimedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await PointClaim.countDocuments({ userId });

    res.json({
      history: pointClaims.map(claim => ({
        id: claim._id,
        points: claim.points,
        claimedBy: claim.claimedBy.name,
        timestamp: claim.createdAt,
        description: claim.description
      })),
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + pointClaims.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ error: 'Server error while fetching user history' });
  }
});

// Get leaderboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalClaims = await PointClaim.countDocuments();
    const totalPoints = await PointClaim.aggregate([
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);

    const topUser = await User.findOne({ isActive: true })
      .sort({ totalPoints: -1 })
      .select('name totalPoints');

    res.json({
      stats: {
        totalUsers,
        totalClaims,
        totalPointsAwarded: totalPoints[0]?.total || 0,
        topUser: topUser ? {
          name: topUser.name,
          points: topUser.totalPoints
        } : null
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error while fetching stats' });
  }
});

module.exports = router;