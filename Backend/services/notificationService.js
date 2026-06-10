const Notification = require('../models/Notification');

const notify = async ({
  recipient,
  recipientModel,
  title,
  message,
  type,
  reference,
  referenceModel
}) => {
  try {
    await Notification.create({
      recipient,
      recipientModel,
      title,
      message,
      type,
      reference,
      referenceModel
    });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = { notify };