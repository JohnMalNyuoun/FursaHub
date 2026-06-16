const Course = require('../../models/course');
const User = require('../../models/Users');
const Organisation = require('../../models/Organisation');
const Application = require('../../models/Application');
const { success, error } = require('../../utils/apiResponse');

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Admin
const getAllCourses = async (req, res) => {
  try {
    const { status, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const courses = await Course.find(filter)
      .populate('organisation', 'name type location')
      .sort({ createdAt: -1 });

    return success(res, 200, 'Courses fetched', courses);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get single course
// @route   GET /api/admin/courses/:id
// @access  Admin
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('organisation', 'name type location email phoneNumber');

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    return success(res, 200, 'Course fetched', course);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Cancel a course
// @route   PUT /api/admin/courses/:id/cancel
// @access  Admin
const cancelCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    if (course.status === 'cancelled') {
      return error(res, 400, 'Course is already cancelled');
    }

    course.status = 'cancelled';
    await course.save();

    return success(res, 200, 'Course cancelled', {
      id: course._id,
      title: course.title,
      status: course.status
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/courses/stats
// @access  Admin
const getPlatformStats = async (req, res) => {
  try {
    const [
      totalYouth,
      totalOrganisations,
      pendingOrganisations,
      totalCourses,
      publishedCourses,
      totalApplications
    ] = await Promise.all([
      User.countDocuments({ role: 'youth' }),
      Organisation.countDocuments({ status: 'approved' }),
      Organisation.countDocuments({ status: 'pending' }),
      Course.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Application.countDocuments()
    ]);

    return success(res, 200, 'Platform stats fetched', {
      totalYouth,
      totalOrganisations,
      pendingOrganisations,
      totalCourses,
      publishedCourses,
      totalApplications
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  cancelCourse,
  getPlatformStats
};