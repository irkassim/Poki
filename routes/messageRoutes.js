const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtilities');
const messageController = require('../controllers/messageController');
const { extendRefreshToken } = require('../middleware/extendRefreshToken');
const authenticate=require('../utils/authenticate');
// Send a message
router.post('/send', verifyToken, 
  messageController.sendMessage);

// Get all messages in a conversation
router.get('/conversation/:conversationId', authenticate, 
    messageController.getConversationMessages);

// Get all conversations for a user
router.get('/conversations', authenticate,
     messageController.getUserConversations);

module.exports = router;
