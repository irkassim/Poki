const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtilities');
const { extendRefreshToken } = require('../middlewares/extendRefreshToken');
const likeController = require('../controllers/likeController');

// Like a profile
router.post('/profile', verifyToken,
     likeController.likeProfile);

// Like a photo
router.post('/photo', verifyToken, 
     likeController.likePhoto);

module.exports = router;
