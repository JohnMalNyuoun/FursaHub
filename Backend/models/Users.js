const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  communityType: {
    type: String,
    enum: ['refugee', 'host_community'],
    required: true
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'prefer_not_to_say']
  },
  phoneNumber: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['youth', 'admin'],
    default: 'youth'
  },
  photo: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  language: {
    type: String,
    enum: ['en', 'sw', 'fr', 'ar'],
    default: 'en'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);