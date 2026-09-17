const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      ref: 'Appointment'
    },
    hospitalId: {
      type: String,
      required: true
    },
    doctorId: {
      type: String,
      required: true
    },
    tokenNumber: {
      type: String,
      required: true
    },
    currentlyServing: {
      type: String,
      required: true
    },
    peopleAhead: {
      type: Number,
      default: 3
    },
    estimatedWaitMinutes: {
      type: Number,
      default: 30
    },
    avgConsultationMinutes: {
      type: Number,
      default: 10
    },
    status: {
      type: String,
      enum: ['WAITING', 'ALMOST YOUR TURN', 'YOUR TURN', 'COMPLETED'],
      default: 'WAITING'
    },
    counterRoom: {
      type: String,
      default: 'Room 204 (OPD Block A)'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Queue', queueSchema);
