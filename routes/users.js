var express = require('express');
var router = express.Router();
var	userHandlers = require('../controllers/userController.js');
 
/* GET users listing. */
router.post('/verify', userHandlers.verify);
router.post('/register', userHandlers.register);
router.post('/update', userHandlers.update);
router.post('/payment', userHandlers.payment);

module.exports = router;