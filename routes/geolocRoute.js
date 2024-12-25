const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtilities');
const geolocController = require('../controllers/geolocController');

// Block a user
router.post('/block', verifyToken, geolocController.getGeoLoc );

//router.post('/unblock', verifyToken, userController.unblockUser);


module.exports = router;