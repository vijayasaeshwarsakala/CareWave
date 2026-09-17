const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentCode: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    userName: {
      type: String,
      required: true
    },
    userPhone: {
      type: String,
      default: ''
    },
    hospitalId: {
      type: String,
      required: true,
      ref: 'Hospital'
    },
    hospitalName: {
      type: String,
      required: true
    },
    doctorId: {
      type: String,
      required: true,
      ref: 'Doctor'
    },
    doctorName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED'
    },
    reason: {
      type: String,
      default: 'Routine Consultation'
    },
    queueId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
