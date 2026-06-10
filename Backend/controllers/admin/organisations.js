const Organisation = require('../../models/Organisation');
const { success, error } = require('../../utils/apiResponse');
const { notify } = require('../../services/notificationService');

// @desc    Get all organisations
// @route   GET /api/admin/organisations
// @access  Admin
const getAllOrganisations = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const organisations = await Organisation.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    return success(res, 200, 'Organisations fetched', organisations);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Get single organisation
// @route   GET /api/admin/organisations/:id
// @access  Admin
const getOrganisation = async (req, res) => {
  try {
    const org = await Organisation.findById(req.params.id).select('-password');

    if (!org) {
      return error(res, 404, 'Organisation not found');
    }

    return success(res, 200, 'Organisation fetched', org);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Approve organisation
// @route   PUT /api/admin/organisations/:id/approve
// @access  Admin
const approveOrganisation = async (req, res) => {
  try {
    const org = await Organisation.findById(req.params.id);

    if (!org) {
      return error(res, 404, 'Organisation not found');
    }

    if (org.status === 'approved') {
      return error(res, 400, 'Organisation is already approved');
    }

    org.status = 'approved';
    org.approvedBy = req.user.id;
    org.approvedAt = new Date();
    org.rejectionReason = undefined;

    await org.save();

    await notify({
      recipient: org._id,
      recipientModel: 'Organisation',
      title: 'Organisation Approved',
      message: `Your organisation ${org.name} has been approved. You can now post courses on FursaHub.`,
      type: 'org_approved',
      reference: org._id,
      referenceModel: 'Organisation'
    });

    return success(res, 200, 'Organisation approved successfully', {
      id: org._id,
      name: org.name,
      status: org.status,
      approvedAt: org.approvedAt
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Reject organisation
// @route   PUT /api/admin/organisations/:id/reject
// @access  Admin
const rejectOrganisation = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return error(res, 400, 'Please provide a rejection reason');
    }

    const org = await Organisation.findById(req.params.id);

    if (!org) {
      return error(res, 404, 'Organisation not found');
    }

    if (org.status === 'rejected') {
      return error(res, 400, 'Organisation is already rejected');
    }

    org.status = 'rejected';
    org.rejectionReason = rejectionReason;

    await org.save();

    await notify({
      recipient: org._id,
      recipientModel: 'Organisation',
      title: 'Organisation Application Rejected',
      message: `Your organisation application was rejected. Reason: ${rejectionReason}`,
      type: 'org_rejected',
      reference: org._id,
      referenceModel: 'Organisation'
    });

    return success(res, 200, 'Organisation rejected', {
      id: org._id,
      name: org.name,
      status: org.status,
      rejectionReason: org.rejectionReason
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Suspend organisation
// @route   PUT /api/admin/organisations/:id/suspend
// @access  Admin
const suspendOrganisation = async (req, res) => {
  try {
    const org = await Organisation.findById(req.params.id);

    if (!org) {
      return error(res, 404, 'Organisation not found');
    }

    if (org.status === 'suspended') {
      return error(res, 400, 'Organisation is already suspended');
    }

    org.status = 'suspended';
    org.isActive = false;

    await org.save();

    return success(res, 200, 'Organisation suspended', {
      id: org._id,
      name: org.name,
      status: org.status
    });

  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisation,
  approveOrganisation,
  rejectOrganisation,
  suspendOrganisation
};