const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtilities');
const userController = require('../controllers/userController');

// Block a user
router.post('/block', verifyToken, userController.blockUser);

router.post('/unblock', verifyToken, userController.unblockUser);


module.exports = router;
