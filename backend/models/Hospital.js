const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide hospital name'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide hospital city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide hospital state'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide full address']
    },
    phone: {
      type: String,
      default: '+91 1800-CARE-WAVE'
    },
    type: {
      type: String,
      default: 'Super-Specialty'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    timings: {
      type: String,
      default: '24x7 Emergency | OPD: 08:00 AM - 08:00 PM'
    },
    totalBeds: {
      type: Number,
      default: 500
    },
    emergencyAvailable: {
      type: Boolean,
      default: true
    },
    departments: [
      {
        type: String,
        trim: true
      }
    ],
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Hospital', hospitalSchema);
