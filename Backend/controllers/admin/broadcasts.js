// controllers/admin/broadcasts.js
const Broadcast = require('../../models/Broadcast');
const Notification = require('../../models/Notification');
const User = require('../../models/Users');
const Organisation = require('../../models/Organisation');
const cloudinary = require('../../config/cloudinary');
const { success, error } = require('../../utils/apiResponse');

const uploadBroadcastImage = async (file) => {
  if (!file) return null;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured on the server.');
  }

  const uploadResult = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    {
      resource_type: 'image',
      folder: 'fursahub/broadcasts',
      transformation: [{ width: 1200, crop: 'limit' }]
    }
  );

  return uploadResult.secure_url;
};

// @desc    Create an admin broadcast and fan out to all recipients
// @route   POST /api/admin/broadcasts
// @access  Admin
const createBroadcast = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    if (!title || !message) {
      return error(res, 400, 'Title and message are required');
    }

    const normalizedAudience = ['all', 'youth', 'organisations'].includes(audience)
      ? audience
      : 'all';

    let image = null;
    try {
      image = await uploadBroadcastImage(req.file);
    } catch (uploadErr) {
      return error(res, 400, uploadErr.message);
    }

    const broadcast = await Broadcast.create({
      title: title.trim(),
      message: message.trim(),
      image,
      audience: normalizedAudience,
      createdBy: req.user?.id
    });

    const recipients = [];

    if (normalizedAudience === 'all' || normalizedAudience === 'youth') {
      const youthIds = await User.find({ role: 'youth', isActive: { $ne: false } }).select('_id');
      youthIds.forEach((u) => {
        recipients.push({
          recipient: u._id,
          recipientModel: 'User',
          title: broadcast.title,
          message: broadcast.message,
          image: broadcast.image,
          type: 'admin_broadcast',
          reference: broadcast._id,
          referenceModel: 'Broadcast'
        });
      });
    }

    if (normalizedAudience === 'all' || normalizedAudience === 'organisations') {
      const orgIds = await Organisation.find({}).select('_id');
      orgIds.forEach((o) => {
        recipients.push({
          recipient: o._id,
          recipientModel: 'Organisation',
          title: broadcast.title,
          message: broadcast.message,
          image: broadcast.image,
          type: 'admin_broadcast',
          reference: broadcast._id,
          referenceModel: 'Broadcast'
        });
      });
    }

    if (recipients.length > 0) {
      await Notification.insertMany(recipients, { ordered: false });
    }

    broadcast.recipientCount = recipients.length;
    await broadcast.save();

    return success(res, 201, 'Broadcast sent', broadcast);

  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    List previous broadcasts
// @route   GET /api/admin/broadcasts
// @access  Admin
const listBroadcasts = async (req, res) => {
  try {
    const broadcasts = await Broadcast.find()
      .sort({ createdAt: -1 })
      .limit(100);
    return success(res, 200, 'Broadcasts fetched', broadcasts);
  } catch (err) {
    return error(res, 500, err.message);
  }
};

// @desc    Delete a broadcast (and its notifications)
// @route   DELETE /api/admin/broadcasts/:id
// @access  Admin
const deleteBroadcast = async (req, res) => {
  try {
    const broadcast = await Broadcast.findById(req.params.id);
    if (!broadcast) return error(res, 404, 'Broadcast not found');

    await Notification.deleteMany({
      type: 'admin_broadcast',
      reference: broadcast._id
    });
    await broadcast.deleteOne();

    return success(res, 200, 'Broadcast deleted');
  } catch (err) {
    return error(res, 500, err.message);
  }
};

module.exports = { createBroadcast, listBroadcasts, deleteBroadcast };
