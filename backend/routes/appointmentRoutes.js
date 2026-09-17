const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getMyAppointments);

router.route('/:id')
  .get(protect, getAppointmentById);

router.route('/:id/cancel')
  .put(protect, cancelAppointment);

module.exports = router;
