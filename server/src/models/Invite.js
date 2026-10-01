const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  eventId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  friendsAttending: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invite', inviteSchema);
