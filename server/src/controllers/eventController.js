const ticketmasterService = require('../services/ticketmaster');

exports.getEvents = async (req, res, next) => {
  try {
    const events = await ticketmasterService.getEvents(req.query);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await ticketmasterService.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
};
