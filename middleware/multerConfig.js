const multer = require('multer');

// Configure Multer for file and field handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Invalid file type')); // Reject file
    }
  },
});

// Middleware for handling files and fields
const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'publicPhoto', maxCount: 9 }, // Max 9 public photos
  { name: 'vaultImage', maxCount: 10 }, // Arbitrary high limit
]);

module.exports = { uploadFields };
