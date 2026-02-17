const express = require('express');
const router = express.Router();
const { getTarjetaByQR } = require('../controllers/qrController');

router.get('/:codigo', getTarjetaByQR);

module.exports = router;
