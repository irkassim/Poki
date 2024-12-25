const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
//const { getProfile } = require('../controllers/profileController');
const { verifyToken } = require('../utils/jwtUtilities');
const { extendRefreshToken }  = require('../middleware/extendRefreshToken')
const { uploadFields } = require('../middleware/multerConfig');
const upload = require('../middleware/upload');
//const multer = require('multer');
//const upload = multer();

const router = express.Router();

// Validation for profile updates
const validateProfileUpdate = [
  
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('bio').optional().isLength({ max: 200 }).withMessage('Bio cannot exceed 200 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];

// Use in your route
router.put('/update', verifyToken,  profileController.updateProfile);

// User profile update route
/* router.put('/update', verifyToken,upload.fields([
  { name: 'bio',maxCount: 1 }, // Text field
  { name: 'gender',maxCount: 1 }, // Text field
  { name: 'preference',maxCount: 1 }, // Text field
  { name: 'refreshToken',maxCount: 1 }, // Text field
  { name: 'avatar', maxCount: 1 }, // Handle avatar uploads
]),
   profileController.updateProfile); */

// GET Profile Route
router.post('/user', verifyToken, 
 profileController.getProfile);

module.exports = router;
