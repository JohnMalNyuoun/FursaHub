const express = require('express');
const router = express.Router();
const {
  getAllOrganisations,
  getOrganisation,
  approveOrganisation,
  rejectOrganisation,
  suspendOrganisation
} = require('../../controllers/admin/organisations');
const { protect } = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/isAdmin');

router.get('/', protect, isAdmin, getAllOrganisations);
router.get('/:id', protect, isAdmin, getOrganisation);
router.put('/:id/approve', protect, isAdmin, approveOrganisation);
router.put('/:id/reject', protect, isAdmin, rejectOrganisation);
router.put('/:id/suspend', protect, isAdmin, suspendOrganisation);

module.exports = router;