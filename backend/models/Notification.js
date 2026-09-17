const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['QUEUE_UPDATE', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'REMINDER', 'SYSTEM'],
      default: 'SYSTEM'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      default: '/dashboard'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
