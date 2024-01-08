const express = require('express');
const router = express.Router();
const controller = require('../controllers/week.controller');
const { isLoggedIn} = require('../lib/auth');


router.get('/', isLoggedIn, controller);

module.exports = router;