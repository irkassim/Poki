const express = require('express');
const { verifyToken } = require('../utils/jwtUtilities');
const matchController = require('../controllers/matchController');
const  {extendRefreshToken} = require('../middleware/extendRefreshToken');


const router = express.Router();
//match someone
router.post('/initiate/:userId', verifyToken,
     matchController.initiateMatch);

//accept match
router.post('/accept/:matchId', verifyToken,
      matchController.acceptMatch);

      console.log("RouteFound")

//reject match
router.post('/reject/:matchId', verifyToken,
      matchController.rejectMatch);

module.exports = router;
