const dbService = require('../services/dbService');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res, next) => {
  try {
    const { hospitalId, doctorId, department, appointmentDate, timeSlot, reason } = req.body;

    if (!hospitalId || !doctorId || !department || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields: hospitalId, doctorId, department, appointmentDate, timeSlot'
      });
    }

    const userId = req.user._id || req.user.id;
    const userName = req.user.name;
    const userPhone = req.user.phone;

    const result = await dbService.createAppointment({
      userId,
      userName,
      userPhone,
      hospitalId,
      doctorId,
      department,
      appointmentDate,
      timeSlot,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: {
        appointment: result.appointment,
        queue: result.queue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's appointments
// @route   GET /api/appointments
// @access  Private
const getMyAppointments = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const appointments = await dbService.getUserAppointments(userId);

    // Enrich with queue status for quick display
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const queue = await dbService.getQueueByAppointmentId(appt._id || appt.id);
        return {
          ...appt,
          queue: queue || null
        };
      })
    );

    res.json({
      success: true,
      count: enrichedAppointments.length,
      data: enrichedAppointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appt = await dbService.getAppointmentById(req.params.id);
    if (!appt) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const queue = await dbService.getQueueByAppointmentId(appt._id || appt.id);

    res.json({
      success: true,
      data: {
        ...appt,
        queue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const appt = await dbService.cancelAppointment(req.params.id, userId);

    if (!appt) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or unauthorized to cancel'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment
};
