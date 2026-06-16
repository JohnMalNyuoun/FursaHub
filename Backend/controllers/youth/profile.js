const bcrypt = require('bcryptjs');
const User = require('../../models/Users');
const { success, error } = require('../../utils/apiResponse');
const cloudinary = require('../../config/cloudinary');

// @desc    Get youth profile
// @route   GET /api/youth/profile
// @access  Youth
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return error(res, 404, 'User not found');
    return success(res, 200, 'Profile fetched', user);
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update youth profile
// @route   PUT /api/youth/profile
// @access  Youth
const updateProfile = async (req, res) => {
  try {
    const { fullName, age, gender, phoneNumber, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return success(res, 200, 'Profile updated', {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      photo: user.photo,
      communityType: user.communityType,
      notificationsEnabled: user.notificationsEnabled,
      theme: user.theme,
      language: user.language,
      role: user.role
    });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update profile photo
// @route   PUT /api/youth/profile/photo
// @access  Youth
const updatePhoto = async (req, res) => {
  try {
    if (!req.file) return error(res, 400, 'No photo uploaded');

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'fursahub/profiles',
        transformation: [{ width: 400, height: 400, crop: 'fill' }]
      }
    );

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    user.photo = uploadResult.secure_url;
    await user.save();

    return success(res, 200, 'Photo updated', { photo: user.photo });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Change password
// @route   PUT /api/youth/profile/password
// @access  Youth
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return error(res, 400, 'Please provide current and new password');
    }

    if (newPassword.length < 6) {
      return error(res, 400, 'New password must be at least 6 characters');
    }

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return error(res, 401, 'Current password is incorrect');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return success(res, 200, 'Password changed successfully');
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update notification settings
// @route   PUT /api/youth/profile/notifications
// @access  Youth
const updateNotifications = async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    user.notificationsEnabled = notificationsEnabled;
    await user.save();

    return success(res, 200, 'Notification settings updated', {
      notificationsEnabled: user.notificationsEnabled
    });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update theme preference
// @route   PUT /api/youth/profile/theme
// @access  Youth
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
      return error(res, 400, 'Invalid theme value');
    }

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    user.theme = theme;
    await user.save();

    return success(res, 200, 'Theme updated', { theme: user.theme });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update language preference
// @route   PUT /api/youth/profile/language
// @access  Youth
const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'sw', 'fr', 'ar'].includes(language)) {
      return error(res, 400, 'Invalid language value');
    }

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    user.language = language;
    await user.save();

    return success(res, 200, 'Language updated', { language: user.language });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePhoto,
  changePassword,
  updateNotifications,
  updateTheme,
  updateLanguage
};
