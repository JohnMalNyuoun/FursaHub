const bcrypt = require('bcryptjs');
const User = require('../../models/Users');
const generateToken = require('../../utils/generateToken');
const { success, error } = require('../../utils/apiResponse');

// @desc    Register youth
// @route   POST /api/auth/youth/register
// @access  Public
const registerYouth = async (req, res) => {
  try {
    const { fullName, email, password, communityType, dateOfBirth, age, gender, phoneNumber } = req.body;

    // Check required fields
    if (!fullName || !email || !password || !communityType) {
      return error(res, 400, 'Please provide fullName, email, password and communityType');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 400, 'Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const resolvedDateOfBirth = dateOfBirth
      ? new Date(dateOfBirth)
      : undefined;

    if (dateOfBirth && Number.isNaN(resolvedDateOfBirth.getTime())) {
      return error(res, 400, 'Invalid dateOfBirth value');
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      communityType,
      dateOfBirth: resolvedDateOfBirth,
      ...(age !== undefined ? { age } : {}),
      gender,
      phoneNumber
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    return success(res, 201, 'Registration successful', {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        communityType: user.communityType,
        role: user.role
      }
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Login youth
// @route   POST /api/auth/youth/login
// @access  Public
const loginYouth = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return error(res, 400, 'Please provide email and password');
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return error(res, 401, 'Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      return error(res, 403, 'Your account has been deactivated');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return success(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        communityType: user.communityType,
        role: user.role
      }
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = { registerYouth, loginYouth };
