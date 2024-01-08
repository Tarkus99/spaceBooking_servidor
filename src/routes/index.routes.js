const express = require('express');
const router = express.Router();

const title = 'INDEX DESDE EL SERVIDOR'

router.get('/', (req, res) => {
    res.send("Hello")
})

module.exports = router;