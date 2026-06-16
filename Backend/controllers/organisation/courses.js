const Course = require('../../models/course');
const cloudinary = require('../../config/cloudinary');
const { success, error } = require('../../utils/apiResponse');

const parseQuestionsPayload = (questions) => {
  if (Array.isArray(questions)) return questions;
  if (questions === undefined || questions === null || questions === '') return [];
  if (typeof questions !== 'string') return null;

  try {
    const parsed = JSON.parse(questions);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
};

const uploadCourseCover = async (file) => {
  if (!file) return null;

  const uploadResult = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    {
      folder: 'fursahub/course-covers',
      transformation: [{ width: 1200, height: 675, crop: 'fill' }]
    }
  );

  return uploadResult.secure_url;
};

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
      applicationQuestions,
      googleFormLink
    } = req.body;
    const parsedQuestions = parseQuestionsPayload(applicationQuestions);

    if (parsedQuestions === null) {
      return error(res, 400, 'Invalid application questions payload');
    }

    // Check required fields
    if (!title || !description || !category || !targetAudience || !location || !deliveryMode || !startDate || !endDate || !applicationDeadline || !totalSlots) {
      return error(res, 400, 'Please provide all required fields');
    }

    // Require at least one non-empty eligibility question at creation time
    const hasValidQuestions = parsedQuestions.length > 0
      && parsedQuestions.some((q) => q && typeof q.question === 'string' && q.question.trim().length > 0);

    if (!hasValidQuestions) {
      return error(res, 400, 'Please add at least one application question before posting');
    }

    const coverImage = await uploadCourseCover(req.file);

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
      applicationQuestions: parsedQuestions,
      googleFormLink: googleFormLink || null,
      coverImage
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
      applicationQuestions,
      googleFormLink
    } = req.body;
    const parsedQuestions = applicationQuestions === undefined
      ? undefined
      : parseQuestionsPayload(applicationQuestions);

    if (parsedQuestions === null) {
      return error(res, 400, 'Invalid application questions payload');
    }

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

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (ageMin !== undefined) updateData.ageMin = ageMin;
    if (ageMax !== undefined) updateData.ageMax = ageMax;
    if (gender !== undefined) updateData.gender = gender;
    if (location !== undefined) updateData.location = location;
    if (deliveryMode !== undefined) updateData.deliveryMode = deliveryMode;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (applicationDeadline !== undefined) updateData.applicationDeadline = applicationDeadline;
    if (totalSlots !== undefined) updateData.totalSlots = totalSlots;
    if (parsedQuestions !== undefined) updateData.applicationQuestions = parsedQuestions;
    if (googleFormLink !== undefined) {
      updateData.googleFormLink = googleFormLink || null;
    }
    if (req.file) {
      updateData.coverImage = await uploadCourseCover(req.file);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
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