const express = require('express');
const router = express.Router();
const {
  createCourse,
  getOrgCourses,
  getOrgCourse,
  updateCourse,
  publishCourse,
  closeCourse,
  deleteCourse
} = require('../../controllers/organisation/courses');
const { protect } = require('../../middleware/auth');
const { isOrganisation } = require('../../middleware/isOrganisation');

router.post('/', protect, isOrganisation, createCourse);
router.get('/', protect, isOrganisation, getOrgCourses);
router.get('/:id', protect, isOrganisation, getOrgCourse);
router.put('/:id', protect, isOrganisation, updateCourse);
router.put('/:id/publish', protect, isOrganisation, publishCourse);
router.put('/:id/close', protect, isOrganisation, closeCourse);
router.delete('/:id', protect, isOrganisation, deleteCourse);

module.exports = router;
