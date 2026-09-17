const express = require('express');
const router = express.Router();
const { getNotifications, markRead, getStats } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markRead);
router.get('/stats', getStats);

module.exports = router;
