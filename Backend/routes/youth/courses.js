const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse } = require('../../controllers/youth/courses');
const { protect } = require('../../middleware/auth');
const { isYouth } = require('../../middleware/isYouth');

router.get('/', protect, isYouth, getAllCourses);
router.get('/:id', protect, isYouth, getCourse);

module.exports = router;