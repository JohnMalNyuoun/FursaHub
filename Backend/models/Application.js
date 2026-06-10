const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  youth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organisation',
    required: true
  },
  answers: [
    {
      question: { type: String },
      answer: { type: String }
    }
  ],
  status: {
    type: String,
    enum: [
      'submitted',
      'under_review',
      'shortlisted',
      'accepted',
      'rejected',
      'withdrawn'
    ],
    default: 'submitted'
  },
  rejectionReason: {
    type: String
  },
  shortlistedAt: {
    type: Date
  },
  shortlistNote: {
    type: String
  },
  nextStep: {
    type: {
      type: String,
      enum: ['in_person', 'online']
    },
    location: { type: String },
    scheduledAt: { type: Date }
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organisation'
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

// One application per youth per course
applicationSchema.index(
  { youth: 1, course: 1 },
  { unique: true }
);

module.exports = mongoose.model('Application', applicationSchema);