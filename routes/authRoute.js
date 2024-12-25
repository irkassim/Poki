const express = require('express');
const authController = require('../controllers/authController');
const { refreshToken } = require('../middleware/refreshToken');

const router = express.Router();

// Validation for user registration
/* const validateSignup = [ body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('dateOfBirth').isISO8601().withMessage('Date of birth must be in YYYY-MM-DD format'),
   
  ]; */

// User registration route
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// Route for refreshing token
router.post('/refresh', refreshToken);

module.exports = router;
