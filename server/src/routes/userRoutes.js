const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/auth');

router.patch('/me/reminders', requireAuth, userController.updateReminders);

module.exports = router;
