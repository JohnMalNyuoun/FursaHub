const Course = require('../../models/Course');
const { success, error } = require('../../utils/apiResponse');

// @desc    Get all published courses
// @route   GET /api/youth/courses
// @access  Youth
const getAllCourses = async (req, res) => {
  try {
    const { category, deliveryMode, targetAudience, search } = req.query;

    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (deliveryMode) filter.deliveryMode = deliveryMode;
    if (targetAudience) filter.targetAudience = { $in: [targetAudience, 'both'] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('organisation', 'name type location')
      .sort({ createdAt: -1 });

    return success(res, 200, 'Courses fetched', courses);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get single course
// @route   GET /api/youth/courses/:id
// @access  Youth
const getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      status: 'published'
    }).populate('organisation', 'name type location phoneNumber email');

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    return success(res, 200, 'Course fetched', course);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = { getAllCourses, getCourse };