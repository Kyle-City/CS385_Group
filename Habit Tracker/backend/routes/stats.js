const express = require('express');
const Habit = require('../models/Habit');
const Checkin = require('../models/Checkin');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /stats/overview
router.get('/overview', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total habits
    const totalHabits = await Habit.countDocuments({ userId });

    // Get total check-ins
    const totalCheckins = await Checkin.countDocuments({ userId });

    // Get longest streak
    const habits = await Habit.find({ userId });
    const longestStreak = habits.reduce((max, habit) => {
      return habit.streak > max ? habit.streak : max;
    }, 0);

    res.json({
      totalHabits,
      totalCheckins,
      longestStreak,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;




