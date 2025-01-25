const express = require('express');
const { verifyToken } = require('../utils/jwtUtilities');
const locationController = require('../controllers/locationController');
//const { extendRefreshToken }  = require('../middleware/extendRefreshToken')

const router = express.Router();

// Update user location
router.post('/update', verifyToken, 
     locationController.updateLocation);

// Get suggestions by location
router.get('/suggestions', verifyToken,
    locationController.getSuggestions);

module.exports = router;
