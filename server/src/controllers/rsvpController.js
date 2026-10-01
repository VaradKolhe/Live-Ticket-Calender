const RSVP = require('../models/RSVP');

exports.createRSVP = async (req, res, next) => {
  try {
    const { eventId, eventName, eventDate, eventTime, venue } = req.body;
    
    if (!eventId || !eventName || !eventDate) {
      return res.status(400).json({ error: 'eventId, eventName, and eventDate are required' });
    }

    const newRsvp = new RSVP({
      userId: req.user.userId,
      eventId,
      eventName,
      eventDate,
      eventTime,
      venue
    });

    await newRsvp.save();
    res.status(201).json(newRsvp);
  } catch (err) {
    next(err);
  }
};

exports.getRSVPs = async (req, res, next) => {
  try {
    const rsvps = await RSVP.find({ userId: req.user.userId }).sort({ eventDate: 1 });
    res.json(rsvps);
  } catch (err) {
    next(err);
  }
};

exports.deleteRSVP = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const rsvp = await RSVP.findOneAndDelete({ 
      userId: req.user.userId,
      eventId 
    });

    if (!rsvp) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    res.json({ message: 'RSVP removed successfully' });
  } catch (err) {
    next(err);
  }
};
