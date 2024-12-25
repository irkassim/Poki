const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtilities');
const memoryController = require('../controllers/memoryController');
const upload = require('../middleware/upload');
//const { uploadFields } = require('../middleware/upload');
//const { extendRefreshToken } = require('../middleware/extendRefreshToken');

// Upload a memory
router.post(
  '/upload',verifyToken,
  upload.fields([
    { name: 'memoryFile', maxCount: 1 }, // Single file
    { name: 'description', maxCount: 1 }, // Text field
  ]),
  memoryController.uploadMemory
); 


// Get shared memories
router.get('/shared/:userId', verifyToken, 
   memoryController.getSharedMemories);

// Share a memory
router.patch('/share/:memoryId', verifyToken, 
   memoryController.shareMemory);

   //router.post('/upload', verifyToken, memoryController.uploadMemory);

/* router.post(
    '/upload',
    verifyToken,                     // Ensure token verification middleware is working
    memoryController.uploadMiddleware, // Multer middleware for file upload
    memoryController.uploadMemory    // Memory upload logic
  ); 
 */
  // Upload a memory
//router.post('/upload', verifyToken, upload.single('memoryFile'), memoryController.uploadMemory);


module.exports = router;
