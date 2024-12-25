const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtilities');
const messageController = require('../controllers/messageController');
const { extendRefreshToken } = require('../middleware/extendRefreshToken');

// Send a message
router.post('/send', verifyToken, 
    extendRefreshToken, messageController.sendMessage);

// Get all messages in a conversation
router.get('/conversation/:conversationId', verifyToken, 
    extendRefreshToken, messageController.getConversationMessages);

// Get all conversations for a user
router.get('/conversations', verifyToken,
    extendRefreshToken, messageController.getUserConversations);

module.exports = router;
