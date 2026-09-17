const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    hospitalId: {
      type: String,
      required: true,
      ref: 'Hospital'
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true
    },
    qualification: {
      type: String,
      default: 'MBBS, MD'
    },
    experienceYears: {
      type: Number,
      default: 10
    },
    consultationFee: {
      type: Number,
      default: 800
    },
    rating: {
      type: Number,
      default: 4.8
    },
    availableDays: [
      {
        type: String
      }
    ],
    timeSlots: [
      {
        type: String
      }
    ],
    isDemo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
