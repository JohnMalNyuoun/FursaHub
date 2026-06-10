const { error } = require('../utils/apiResponse');

const isOrganisation = (req, res, next) => {
  if (req.user && req.user.role === 'organisation') {
    next();
  } else {
    return error(res, 403, 'Access denied. Organisations only.');
  }
};

module.exports = { isOrganisation };