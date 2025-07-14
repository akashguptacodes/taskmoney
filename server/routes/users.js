const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users (leaderboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name totalPoints createdAt')
      .sort({ totalPoints: -1 })
      .limit(100);

    res.json({
      users: users.map((user, index) => ({
        id: user._id,
        name: user.name,
        points: user.totalPoints,
        rank: index + 1,
        joinedAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name totalPoints createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        points: user.totalPoints,
        joinedAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});

// Add new user (admin only or public registration)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { name }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        points: user.totalPoints
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error while creating user' });
  }
});

// Update user points (internal use)
router.patch('/:id/points', auth, async (req, res) => {
  try {
    const { points } = req.body;
    
    if (typeof points !== 'number' || points < 0) {
      return res.status(400).json({ error: 'Invalid points value' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalPoints: points } },
      { new: true }
    ).select('name totalPoints');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Points updated successfully',
      user: {
        id: user._id,
        name: user.name,
        points: user.totalPoints
      }
    });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ error: 'Server error while updating points' });
  }
});

module.exports = router;