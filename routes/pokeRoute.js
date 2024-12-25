const express = require('express');
const { verifyToken } = require('../utils/jwtUtilities');
const pokeController = require('../controllers/pokeController');
const { extendRefreshToken }  = require('../middleware/extendRefreshToken')

const router = express.Router();

//router.post('/:userId', verifyToken, pokeController.sendPoke);
//router.post('/accept/:userId', verifyToken, pokeController.acceptPoke);
router.delete('/:userId', verifyToken, pokeController.removePoke);


// Create a poke
router.post('/create', verifyToken,  pokeController.createPoke);

// Accept a poke
router.patch('/accept/:pokeId', verifyToken, 
    extendRefreshToken, pokeController.acceptPoke);

module.exports = router;
