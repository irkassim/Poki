const express = require('express');
const { verifyToken } = require('../utils/jwtUtilities');
const pokeController = require('../controllers/pokeController');
const { extendRefreshToken }  = require('../middleware/extendRefreshToken')

const router = express.Router();

// Create a poke
router.post('/create', verifyToken,  pokeController.createPoke);

// Accept a poke
router.post('/accept/:pokeId', verifyToken, 
   pokeController.acceptPoke);

    // Accept a poke
router.post('/reject/:pokeId', verifyToken, 
    pokeController.removePoke);

module.exports = router;
