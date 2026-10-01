const User = require('../models/User');

exports.updateReminders = async (req, res, next) => {
  try {
    const { enabled, minutesBefore } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (typeof enabled === 'boolean') {
      user.reminderSettings.enabled = enabled;
    }
    if (typeof minutesBefore === 'number') {
      user.reminderSettings.minutesBefore = minutesBefore;
    }

    await user.save();

    res.json(user.reminderSettings);
  } catch (err) {
    next(err);
  }
};
