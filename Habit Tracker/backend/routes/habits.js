const express = require('express');
const Habit = require('../models/Habit');
const Checkin = require('../models/Checkin');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /habits/create
router.post('/create', async (req, res) => {
  try {
    const { name, description, color, icon, startDate, checkinInterval } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    // Validate checkinInterval
    const interval = checkinInterval ? parseInt(checkinInterval) : 1;
    if (isNaN(interval) || interval < 1) {
      return res.status(400).json({ message: 'Check-in interval must be at least 1 day' });
    }

    const habit = new Habit({
      userId: req.user._id,
      name,
      description: description || '',
      color: color || '#4CAF50',
      icon: icon || '⭐',
      startDate: startDate ? new Date(startDate) : new Date(),
      streak: 0,
      totalCompletions: 0,
      checkinInterval: interval,
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error creating habit' });
  }
});

// GET /habits
router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;
    let habits = await Habit.find({ userId: req.user._id });

    if (sort === 'streak') {
      habits.sort((a, b) => b.streak - a.streak);
    } else if (sort === 'recent') {
      habits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(habits);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error fetching habits' });
  }
});

// GET /habits/:id
router.get('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ message: 'Server error fetching habit' });
  }
});

// PUT /habits/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (name) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (color) habit.color = color;
    if (icon) habit.icon = icon;

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error updating habit' });
  }
});

// DELETE /habits/:id
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Delete all check-ins for this habit
    await Checkin.deleteMany({ habitId: habit._id });

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error deleting habit' });
  }
});

// POST /habits/:id/checkin
router.post('/:id/checkin', async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingCheckin = await Checkin.findOne({
      habitId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingCheckin) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    // Check if enough time has passed since last check-in (based on checkinInterval)
    const checkinInterval = habit.checkinInterval || 1;
    
    // Find the last check-in for this habit
    const lastCheckin = await Checkin.findOne({
      habitId,
    }).sort({ date: -1 });

    if (lastCheckin) {
      // Calculate days since last check-in
      const lastCheckinDate = new Date(lastCheckin.date);
      lastCheckinDate.setHours(0, 0, 0, 0);
      
      const daysSinceLastCheckin = Math.floor(
        (today.getTime() - lastCheckinDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysSinceLastCheckin < checkinInterval) {
        const daysRemaining = checkinInterval - daysSinceLastCheckin;
        return res.status(400).json({ 
          message: `Please wait ${daysRemaining} more day(s) before checking in again. Check-in interval is ${checkinInterval} day(s).`,
          daysRemaining,
          checkinInterval,
        });
      }
    }

    // Create new check-in (use today's date at start of day for consistency)
    const checkinDate = new Date(today);
    const checkin = new Checkin({
      habitId,
      userId: req.user._id,
      date: checkinDate,
    });

    await checkin.save();

    // Update streak and total completions
    // Get yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there was a check-in yesterday
    const yesterdayCheckin = await Checkin.findOne({
      habitId,
      date: {
        $gte: yesterday,
        $lt: today,
      },
    });

    if (yesterdayCheckin) {
      // Continue streak
      habit.streak += 1;
    } else {
      // Start new streak
      habit.streak = 1;
    }

    habit.totalCompletions += 1;
    await habit.save();

    res.json({
      message: 'Check-in successful',
      habit,
      checkin,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Server error during check-in' });
  }
});

// GET /habits/:id/checkins
router.get('/:id/checkins', async (req, res) => {
  try {
    const habitId = req.params.id;

    // Verify habit belongs to user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const checkins = await Checkin.find({ habitId }).sort({ date: -1 });
    res.json(checkins);
  } catch (error) {
    console.error('Get checkins error:', error);
    res.status(500).json({ message: 'Server error fetching check-ins' });
  }
});

module.exports = router;

