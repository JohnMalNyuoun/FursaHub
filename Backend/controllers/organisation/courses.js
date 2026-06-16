const Course = require('../../models/course');
const { success, error } = require('../../utils/apiResponse');

// @desc    Post a new course
// @route   POST /api/org/courses
// @access  Organisation
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetAudience,
      ageMin,
      ageMax,
      gender,
      location,
      deliveryMode,
      startDate,
      endDate,
      applicationDeadline,
      totalSlots,
      applicationQuestions
    } = req.body;

    // Check required fields
    if (!title || !description || !category || !targetAudience || !location || !deliveryMode || !startDate || !endDate || !applicationDeadline || !totalSlots) {
      return error(res, 400, 'Please provide all required fields');
    }

    // Require at least one non-empty eligibility question at creation time
    const hasValidQuestions = Array.isArray(applicationQuestions)
      && applicationQuestions.length > 0
      && applicationQuestions.some((q) => q && typeof q.question === 'string' && q.question.trim().length > 0);

    if (!hasValidQuestions) {
      return error(res, 400, 'Please add at least one application question before posting');
    }

    const course = await Course.create({
      organisation: req.user.id,
      title,
      description,
      category,
      targetAudience,
      ageMin,
      ageMax,
      gender,
      location,
      deliveryMode,
      startDate,
      endDate,
      applicationDeadline,
      totalSlots,
      applicationQuestions
    });

    return success(res, 201, 'Course created successfully', course);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get all courses by organisation
// @route   GET /api/org/courses
// @access  Organisation
const getOrgCourses = async (req, res) => {
  try {
    const courses = await Course.find({ organisation: req.user.id })
      .sort({ createdAt: -1 });

    return success(res, 200, 'Courses fetched', courses);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get single course
// @route   GET /api/org/courses/:id
// @access  Organisation
const getOrgCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      organisation: req.user.id
    });

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    return success(res, 200, 'Course fetched', course);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update course
// @route   PUT /api/org/courses/:id
// @access  Organisation
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      organisation: req.user.id
    });

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    if (course.status === 'published') {
      return error(res, 400, 'Cannot edit a published course. Close it first.');
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return success(res, 200, 'Course updated', updatedCourse);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Publish course
// @route   PUT /api/org/courses/:id/publish
// @access  Organisation
const publishCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      organisation: req.user.id
    });

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    if (course.status === 'published') {
      return error(res, 400, 'Course is already published');
    }

    const hasValidQuestions = Array.isArray(course.applicationQuestions)
      && course.applicationQuestions.length > 0
      && course.applicationQuestions.some(
        (q) => q && typeof q.question === 'string' && q.question.trim().length > 0
      );

    if (!hasValidQuestions) {
      return error(res, 400, 'Please add at least one application question before publishing');
    }

    course.status = 'published';
    await course.save();

    return success(res, 200, 'Course published successfully', course);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Close course
// @route   PUT /api/org/courses/:id/close
// @access  Organisation
const closeCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      organisation: req.user.id
    });

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    course.status = 'closed';
    await course.save();

    return success(res, 200, 'Course closed', course);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Delete course
// @route   DELETE /api/org/courses/:id
// @access  Organisation
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      organisation: req.user.id
    });

    if (!course) {
      return error(res, 404, 'Course not found');
    }

    if (course.status === 'published') {
      return error(res, 400, 'Cannot delete a published course. Close it first.');
    }

    await course.deleteOne();

    return success(res, 200, 'Course deleted');

  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = {
  createCourse,
  getOrgCourses,
  getOrgCourse,
  updateCourse,
  publishCourse,
  closeCourse,
  deleteCourse
};