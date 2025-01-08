
const { verifyToken } = require('../utils/jwtUtilities');
const authenticate = require('../utils/authenticate')

const express = require('express');

const {
  getPokes,
  getMatches,
  getMessages,
} = require('../controllers/homePageController'); // Assuming all the new methods are grouped here

const router = express.Router();

// Fetch pokes for the logged-in user
router.get('/pokes', authenticate, getPokes);

// Fetch matches for the logged-in user
router.get('/matches', authenticate, getMatches);

// Fetch messages/conversations for the logged-in user
router.get('/messages', authenticate, getMessages);

module.exports = router;
