const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpController');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.post('/', rsvpController.createRSVP);
router.get('/', rsvpController.getRSVPs);
router.delete('/:eventId', rsvpController.deleteRSVP);

module.exports = router;
