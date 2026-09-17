const dbService = require('../services/dbService');

// @desc    Get live simulated queue status for an appointment
// @route   GET /api/queue/:appointmentId
// @access  Public / Private
const getQueueStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const queue = await dbService.getQueueByAppointmentId(appointmentId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: 'Queue information not found for this appointment'
      });
    }

    const appointment = await dbService.getAppointmentById(appointmentId);
    const hospital = appointment ? await dbService.getHospitalById(appointment.hospitalId) : null;
    const doctor = appointment ? await dbService.getDoctorById(appointment.doctorId) : null;

    res.json({
      success: true,
      disclaimer: 'Demo queue data – not a live hospital queue.',
      data: {
        ...queue,
        appointment: appointment ? {
          appointmentCode: appointment.appointmentCode,
          appointmentDate: appointment.appointmentDate,
          timeSlot: appointment.timeSlot,
          department: appointment.department,
          status: appointment.status
        } : null,
        hospitalName: hospital ? hospital.name : 'Super-Specialty Hospital',
        hospitalAddress: hospital ? hospital.address : '',
        hospitalCity: hospital ? hospital.city : '',
        doctorName: doctor ? doctor.name : 'Specialist Doctor',
        doctorSpecialization: doctor ? doctor.department : ''
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate advancing the queue (calls next patient for presentation demo)
// @route   POST /api/queue/:appointmentId/simulate-advance
// @access  Public / Private
const simulateAdvance = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const updatedQueue = await dbService.advanceQueueSimulation(appointmentId);

    if (!updatedQueue) {
      return res.status(404).json({
        success: false,
        message: 'Queue record not found'
      });
    }

    res.json({
      success: true,
      message: 'Simulated queue state advanced! Next patient called.',
      disclaimer: 'Demo queue data – simulated advance.',
      data: updatedQueue
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQueueStatus,
  simulateAdvance
};
