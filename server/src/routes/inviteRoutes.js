const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');
const requireAuth = require('../middleware/auth');

router.post('/', requireAuth, inviteController.createInvite);
router.get('/:token', inviteController.getInvite);
router.post('/:token/click', inviteController.clickInvite);

module.exports = router;
