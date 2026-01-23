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

// GET /stats/weekly
router.get('/weekly', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all habits for the user
    const habits = await Habit.find({ userId });

    // Calculate stats for each habit (overall completion rate since creation)
    const completionStats = await Promise.all(
      habits.map(async (habit) => {
        // Get all check-ins for this habit (since creation)
        const actualCheckins = await Checkin.countDocuments({
          habitId: habit._id,
          userId,
        });

        // Calculate theoretical maximum check-ins from habit creation to now
        const checkinInterval = habit.checkinInterval || 1;
        
        // Calculate days since habit creation
        const habitCreatedAt = new Date(habit.startDate);
        habitCreatedAt.setHours(0, 0, 0, 0);
        
        let daysSinceCreation = Math.ceil((today.getTime() - habitCreatedAt.getTime()) / (24 * 60 * 60 * 1000));
        // If habit is created today or future, set to at least 1 day
        if (daysSinceCreation < 1) {
          daysSinceCreation = 1;
        }

        // Theoretical maximum: daysSinceCreation / checkinInterval (rounded up)
        // This represents the maximum number of times the habit could have been checked in
        const theoreticalMax = Math.ceil(daysSinceCreation / checkinInterval);

        // Calculate completion rate (actual / theoretical max)
        const ratio = theoreticalMax > 0 ? actualCheckins / theoreticalMax : 0;

        return {
          habitId: habit._id,
          habitName: habit.name,
          icon: habit.icon || '⭐',
          color: habit.color || '#4CAF50',
          actualCheckins,
          theoreticalMax,
          ratio: Math.min(1, ratio), // Cap at 1.0 (100%)
        };
      })
    );

    res.json(completionStats);
  } catch (error) {
    console.error('Get completion stats error:', error);
    res.status(500).json({ message: 'Server error fetching completion stats' });
  }
});

module.exports = router;




