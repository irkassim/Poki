const express = require('express');
const router = express.Router();
const authenticate  = require('../utils/authenticate');
const peopleController = require('../controllers/peopleController');


// Like a profile
router.get('/people', authenticate,
     peopleController.getPeople);



module.exports = router;






