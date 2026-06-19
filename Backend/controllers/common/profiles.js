const User = require('../../models/Users');
const Organisation = require('../../models/Organisation');
const { success, error } = require('../../utils/apiResponse');

// @desc    Get public youth profile
// @route   GET /api/profiles/youth/:id
// @access  Authenticated
const getPublicYouthProfile = async (req, res) => {
  try {
    const youth = await User.findOne({
      _id: req.params.id,
      role: 'youth'
    }).select('fullName username bio photo communityType age gender language createdAt');

    if (!youth) {
      return error(res, 404, 'Youth profile not found');
    }

    return success(res, 200, 'Youth profile fetched', youth);
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get public organisation profile
// @route   GET /api/profiles/organisation/:id
// @access  Authenticated
const getPublicOrganisationProfile = async (req, res) => {
  try {
    const organisation = await Organisation.findById(req.params.id)
      .select('name type description location website logo email phoneNumber status createdAt');

    if (!organisation) {
      return error(res, 404, 'Organisation profile not found');
    }

    return success(res, 200, 'Organisation profile fetched', organisation);
  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = {
  getPublicYouthProfile,
  getPublicOrganisationProfile
};
