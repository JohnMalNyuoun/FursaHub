// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientModel'
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['User', 'Organisation']
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
    enum: [
      'application_submitted',
      'application_shortlisted',
      'application_accepted',
      'application_rejected',
      'course_published',
      'org_approved',
      'org_rejected'
    ],
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId
  },
  referenceModel: {
    type: String,
    enum: ['Course', 'Application', 'Organisation']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);