const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type')); // Reject invalid files
    }
  },
});

module.exports = upload;
