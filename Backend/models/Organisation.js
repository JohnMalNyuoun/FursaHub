const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['NGO', 'CBO', 'UN_Agency', 'educational_institution', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Kakuma'
  },
  phoneNumber: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  documents: [{
    name: { type: String },
    url: { type: String }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'organisation'
  },
  logo: {
    type: String,
    default: null
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    enum: ['en', 'sw', 'fr', 'ar'],
    default: 'en'
  }
}, { timestamps: true });

module.exports = mongoose.model('Organisation', organisationSchema);