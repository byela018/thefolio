// backend/middleware/upload.js
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary config gamit ang environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup ng storage para sa Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'thefolio_uploads', // pangalan ng folder sa Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// Multer instance gamit ang Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
