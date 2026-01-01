const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate check-ins for the same habit on the same day
checkinSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Checkin', checkinSchema);




