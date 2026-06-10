// routes/youth/notifications.js
const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../../controllers/youth/notifications');
const { protect } = require('../../middleware/auth');
const { isYouth } = require('../../middleware/isYouth');

router.get('/', protect, isYouth, getNotifications);
router.put('/read-all', protect, isYouth, markAllAsRead);
router.put('/:id/read', protect, isYouth, markAsRead);

module.exports = router;