const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote'],
      default: 'full-time'
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active'
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    requirements: {
      type: [String],
      default: []
    },
    salaryRange: {
      type: String,
      default: 'Competitive'
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for applicants count
jobSchema.virtual('applicantsCount', {
  ref: 'Applicant',
  localField: '_id',
  foreignField: 'jobId',
  count: true
});

module.exports = mongoose.model('Job', jobSchema);
