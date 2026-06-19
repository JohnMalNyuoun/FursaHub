const bcrypt = require('bcryptjs');
const Organisation = require('../../models/Organisation');
const { success, error } = require('../../utils/apiResponse');
const cloudinary = require('../../config/cloudinary');

// @desc    Get org profile
// @route   GET /api/org/profile
// @access  Organisation
const getProfile = async (req, res) => {
  try {
    const org = await Organisation.findById(req.user.id).select('-password');
    if (!org) return error(res, 404, 'Organisation not found');
    return success(res, 200, 'Profile fetched', org);
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update org profile
// @route   PUT /api/org/profile
// @access  Organisation
const updateProfile = async (req, res) => {
  try {
    const { name, description, phoneNumber, location, website } = req.body;

    const org = await Organisation.findById(req.user.id);
    if (!org) return error(res, 404, 'Organisation not found');

    if (name) org.name = name;
    if (description) org.description = description;
    if (phoneNumber) org.phoneNumber = phoneNumber;
    if (location) org.location = location;
    if (website !== undefined) org.website = website;

    await org.save();

    return success(res, 200, 'Profile updated', {
      id: org._id,
      name: org.name,
      email: org.email,
      description: org.description,
      phoneNumber: org.phoneNumber,
      location: org.location,
      website: org.website,
      logo: org.logo,
      type: org.type,
      status: org.status,
      language: org.language,
      role: org.role
    });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update org logo
// @route   PUT /api/org/profile/logo
// @access  Organisation
const updateLogo = async (req, res) => {
  try {
    if (!req.file) return error(res, 400, 'No logo uploaded');

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        upload_preset: 'Fursahub-profile',
        type: 'upload',
        resource_type: 'image',
        folder: 'fursahub/logos',
        transformation: [{ width: 400, height: 400, crop: 'fill' }]
      }
    );

    const org = await Organisation.findById(req.user.id);
    if (!org) return error(res, 404, 'Organisation not found');

    org.logo = uploadResult.secure_url;
    await org.save();

    return success(res, 200, 'Logo updated', { logo: org.logo });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Change org password
// @route   PUT /api/org/profile/password
// @access  Organisation
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return error(res, 400, 'Please provide current and new password');
    }

    if (newPassword.length < 6) {
      return error(res, 400, 'New password must be at least 6 characters');
    }

    const org = await Organisation.findById(req.user.id);
    if (!org) return error(res, 404, 'Organisation not found');

    const isMatch = await bcrypt.compare(currentPassword, org.password);
    if (!isMatch) return error(res, 401, 'Current password is incorrect');

    const salt = await bcrypt.genSalt(10);
    org.password = await bcrypt.hash(newPassword, salt);
    await org.save();

    return success(res, 200, 'Password changed successfully');
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update notification settings
// @route   PUT /api/org/profile/notifications
// @access  Organisation
const updateNotifications = async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;

    const org = await Organisation.findById(req.user.id);
    if (!org) return error(res, 404, 'Organisation not found');

    org.notificationsEnabled = notificationsEnabled;
    await org.save();

    return success(res, 200, 'Notification settings updated', {
      notificationsEnabled: org.notificationsEnabled
    });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Update language preference
// @route   PUT /api/org/profile/language
// @access  Organisation
const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'sw', 'fr', 'ar'].includes(language)) {
      return error(res, 400, 'Invalid language value');
    }

    const org = await Organisation.findById(req.user.id);
    if (!org) return error(res, 404, 'Organisation not found');

    org.language = language;
    await org.save();

    return success(res, 200, 'Language updated', { language: org.language });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateLogo,
  changePassword,
  updateNotifications,
  updateLanguage
};
