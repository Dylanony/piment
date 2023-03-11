const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const userCtrl = require('../controllers/user');

const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 2, 
	message:'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true,
	legacyHeaders: false,
})

router.post('/signup', createAccountLimiter, userCtrl.signup);
router.post('/login', createAccountLimiter, userCtrl.login);

module.exports = router;