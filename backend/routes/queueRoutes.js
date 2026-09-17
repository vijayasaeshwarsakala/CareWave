const express = require('express');
const router = express.Router();
const { getQueueStatus, simulateAdvance } = require('../controllers/queueController');

router.get('/:appointmentId', getQueueStatus);
router.post('/:appointmentId/simulate-advance', simulateAdvance);

module.exports = router;
