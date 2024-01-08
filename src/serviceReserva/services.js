const express = require('express')
const router = express.Router()
const config = require('../horarioConfig.json');
const { saveSesions } = require('../lib/config');
const horario = saveSesions(config[0]);
const reservaController = require('../controllers/reserva.controller')

router.get('/intervals.service', async (req, res) => {
    res.json(horario)
})

router.get('/info.service', reservaController.get)

module.exports = router;