const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fursahub/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fursahub/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

const uploadProfile = multer({ storage: profileStorage });
const uploadLogo = multer({ storage: logoStorage });

module.exports = { uploadProfile, uploadLogo };
