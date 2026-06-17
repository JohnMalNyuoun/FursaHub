const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/Users');
const { success, error } = require('../../utils/apiResponse');
const cloudinary = require('../../config/cloudinary');
const { sendEmail, hasEmailConfig } = require('../../services/emailService');

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
    const { fullName, username, age, gender, phoneNumber, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    if (username !== undefined) {
      const normalized = username.toLowerCase().trim();
      if (normalized.length < 3) {
        return error(res, 400, 'Username must be at least 3 characters');
      }

      const existing = await User.findOne({ username: normalized, _id: { $ne: req.user.id } });
      if (existing) {
        return error(res, 400, 'Username is already taken');
      }
      user.username = normalized;
    }

    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return success(res, 200, 'Profile updated', {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
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
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return error(res, 400, 'Please provide current and new password');
    }

    if (confirmNewPassword !== undefined && newPassword !== confirmNewPassword) {
      return error(res, 400, 'New password and confirmation do not match');
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

// @desc    Request email change verification
// @route   PUT /api/youth/profile/email/request-change
// @access  Youth
const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return error(res, 400, 'Please provide a new email');
    }

    const normalized = newEmail.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return error(res, 400, 'Invalid email format');
    }

    const user = await User.findById(req.user.id);
    if (!user) return error(res, 404, 'User not found');

    if (user.email === normalized) {
      return error(res, 400, 'New email cannot be the same as current email');
    }

    const emailTaken = await User.findOne({ email: normalized, _id: { $ne: req.user.id } });
    if (emailTaken) {
      return error(res, 400, 'Email already in use');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.pendingEmail = normalized;
    user.emailChangeToken = tokenHash;
    user.emailChangeExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const appUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const verificationUrl = `${appUrl}/profile?verifyEmailToken=${rawToken}`;

    await sendEmail({
      to: normalized,
      subject: 'Verify your new email - FursaHub',
      text: `Verify your new email by opening this link: ${verificationUrl}`,
      html: `<p>Verify your new email by clicking the link below:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>This link expires in 1 hour.</p>`
    });

    return success(res, 200, 'Verification link sent to your new email', {
      email: normalized,
      emailDeliveryConfigured: hasEmailConfig()
    });
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Verify pending email change
// @route   PUT /api/youth/profile/email/verify
// @access  Youth
const verifyEmailChange = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return error(res, 400, 'Verification token is required');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      _id: req.user.id,
      emailChangeToken: tokenHash,
      emailChangeExpires: { $gt: new Date() }
    });

    if (!user || !user.pendingEmail) {
      return error(res, 400, 'Invalid or expired verification token');
    }

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeExpires = undefined;
    user.isVerified = true;
    await user.save();

    return success(res, 200, 'Email updated successfully', { email: user.email });
  } catch (err) {
    if (err.code === 11000) {
      return error(res, 400, 'Email already in use');
    }
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
  requestEmailChange,
  verifyEmailChange,
  updateNotifications,
  updateTheme,
  updateLanguage
};
