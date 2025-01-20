const express = require('express');
const { verifyToken } = require('../utils/jwtUtilities');
const authenticate  = require('../utils/authenticate');
const questionController = require('../controllers/questionController');

//const { extendRefreshToken }  = require('../middleware/extendRefreshToken')

const router = express.Router();

// Create a poke
router.get('/questions', authenticate,  questionController.getCompatibilityTest);

// Accept a poke
router.post("/questions", verifyToken, 
   questionController.submitCompatibilityTest);

module.exports = router;
