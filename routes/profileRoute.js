const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
//const { getProfile } = require('../controllers/profileController');
const { verifyToken } = require('../utils/jwtUtilities');
const { extendRefreshToken }  = require('../middleware/extendRefreshToken')
//const { uploadFields } = require('../middleware/multerConfig');
//const upload = require('../middleware/upload');
const multer = require('multer');
const upload = multer();

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    return res.status(400).json({ error: `Multer Error: ${err.message}` });
  } else if (err) {
    // An unknown error occurred when uploading.
    return res.status(500).json({ error: `Unknown Error: ${err.message}` });
  }
  next();
};


const uploadFields = upload.fields([
  { name: 'refreshToken', maxCount: 1 }, 
  { name: 'publicPhoto', maxCount: 9 },
  { name: 'vaultImage', maxCount: 10 },
 // Important: Make sure this field is allowed
]);
const router = express.Router();

// Validation for profile updates
const validateProfileUpdate = [
  
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('bio').optional().isLength({ max: 200 }).withMessage('Bio cannot exceed 200 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];


// Update Text Fields
  router.put('/update-text', verifyToken, profileController.updateTextFields);

// UPLOAD PHOTOS
  router.put('/update-images', uploadFields,
  multerErrorHandler,
  (req, res, next) => {
    console.log('Parsed form-data:', req.body); // Debugging
    next();
  },
   verifyToken,  profileController.updateImages);

   //GET PHOTOS
   router.put('/photos', verifyToken, profileController.getUserWithPhotoUrls);

   //Delete PHOTO
  router.delete('/delete-image', verifyToken, profileController.deleteImage);
   
   // GET Profile 
  router.post('/user', verifyToken, 
  profileController.getProfile);

  //POST PROFILE PIC
  router.post('/set-avatar', verifyToken, profileController.setUserAvatar);

  

// User profile update route
/* router.put('/update', verifyToken,upload.fields([
  { name: 'bio',maxCount: 1 }, // Text field
  { name: 'gender',maxCount: 1 }, // Text field
  { name: 'preference',maxCount: 1 }, // Text field
  { name: 'refreshToken',maxCount: 1 }, // Text field
  { name: 'avatar', maxCount: 1 }, // Handle avatar uploads
]),
   profileController.updateProfile); */



module.exports = router;
