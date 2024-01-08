const express = require('express');
const router = express.Router();
const controller = require('../controllers/config.controller');
const { parseFormData } = require('parse-nested-form-data');
const { isAdmin, isLoggedIn } = require('../lib/auth')



//TIME_24_SIMPLE

router.use('/config', (req, res) => {
    const config = require('../horarioConfig.json');
    res.send(config)
})

router.post('/config',  async (req, res) => {
    console.log(typeof req.body);
    console.log(req.body);
})

module.exports = router;