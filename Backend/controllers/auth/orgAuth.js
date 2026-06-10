const bcrypt = require('bcryptjs');
const Organisation = require('../../models/Organisation');
const generateToken = require('../../utils/generateToken');
const { success, error } = require('../../utils/apiResponse');

// @desc    Register organisation
// @route   POST /api/auth/org/register
// @access  Public
const registerOrg = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      type,
      description,
      phoneNumber,
      location,
      website
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !type || !description || !phoneNumber) {
      return error(res, 400, 'Please provide name, email, password, type, description and phoneNumber');
    }

    // Check if email already exists
    const existingOrg = await Organisation.findOne({ email });
    if (existingOrg) {
      return error(res, 400, 'Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create organisation
    const org = await Organisation.create({
      name,
      email,
      password: hashedPassword,
      type,
      description,
      phoneNumber,
      location,
      website
    });

    return success(res, 201, 'Registration successful. Awaiting admin approval.', {
      organisation: {
        id: org._id,
        name: org.name,
        email: org.email,
        type: org.type,
        status: org.status,
        role: org.role
      }
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Login organisation
// @route   POST /api/auth/org/login
// @access  Public
const loginOrg = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return error(res, 400, 'Please provide email and password');
    }

    // Find organisation
    const org = await Organisation.findOne({ email });
    if (!org) {
      return error(res, 401, 'Invalid email or password');
    }

    // Check if account is active
    if (!org.isActive) {
      return error(res, 403, 'Your account has been deactivated');
    }

    // Block login if not approved
    if (org.status === 'pending') {
      return error(res, 403, 'Your account is pending admin approval');
    }

    if (org.status === 'rejected') {
      return error(res, 403, `Your account was rejected. Reason: ${org.rejectionReason}`);
    }

    if (org.status === 'suspended') {
      return error(res, 403, 'Your account has been suspended. Contact FursaHub admin.');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(org._id, org.role);

    return success(res, 200, 'Login successful', {
      token,
      organisation: {
        id: org._id,
        name: org.name,
        email: org.email,
        type: org.type,
        status: org.status,
        role: org.role
      }
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = { registerOrg, loginOrg };