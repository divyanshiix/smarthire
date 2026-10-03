const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required']
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offered', 'hired', 'rejected'],
      default: 'applied'
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Applicant', applicantSchema);
