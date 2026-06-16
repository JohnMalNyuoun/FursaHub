const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePhoto,
  changePassword,
  updateNotifications,
  updateTheme,
  updateLanguage
} = require('../../controllers/youth/profile');
const { protect } = require('../../middleware/auth');
const { isYouth } = require('../../middleware/isYouth');
const { uploadProfile } = require('../../middleware/upload');

router.get('/', protect, isYouth, getProfile);
router.put('/', protect, isYouth, updateProfile);
router.put('/photo', protect, isYouth, uploadProfile.single('photo'), updatePhoto);
router.put('/password', protect, isYouth, changePassword);
router.put('/notifications', protect, isYouth, updateNotifications);
router.put('/theme', protect, isYouth, updateTheme);
router.put('/language', protect, isYouth, updateLanguage);

module.exports = router;
