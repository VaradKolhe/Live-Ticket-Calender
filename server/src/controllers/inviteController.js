const crypto = require('crypto');
const Invite = require('../models/Invite');
const RSVP = require('../models/RSVP');

exports.createInvite = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    
    if (!eventId) {
      return res.status(400).json({ error: 'eventId is required' });
    }

    // Ensure the user actually RSVP'd
    const rsvp = await RSVP.findOne({ userId: req.user.userId, eventId });
    if (!rsvp) {
      return res.status(400).json({ error: 'You must RSVP to the event before generating an invite' });
    }

    // Check if invite already exists for this user/event combo
    let invite = await Invite.findOne({ userId: req.user.userId, eventId });
    
    if (!invite) {
      const token = crypto.randomBytes(4).toString('hex'); // 8 characters
      invite = new Invite({
        token,
        eventId,
        userId: req.user.userId
      });
      await invite.save();
    }

    const shareUrl = `${req.protocol}://${req.get('host')}/api/invites/${invite.token}/click`; 
    // In actual app, the frontend url should be shared and it hits the backend, 
    // but for now providing a base struct.

    res.status(201).json({ 
      token: invite.token,
      shareUrl,
      clicks: invite.clicks,
      friendsAttending: invite.friendsAttending
    });
  } catch (err) {
    next(err);
  }
};

exports.getInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const invite = await Invite.findOne({ token }).populate('userId', 'name');
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    res.json(invite);
  } catch (err) {
    next(err);
  }
};

exports.clickInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const invite = await Invite.findOne({ token });
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    // Increment clicks
    invite.clicks += 1;
    // For simplicity in MVP, each click is considered a friend attending, 
    // or maybe it's separate. The requirement says:
    // "Backend records click, Friends Attending count updates"
    invite.friendsAttending += 1;
    
    await invite.save();

    res.json(invite);
  } catch (err) {
    next(err);
  }
};
