const express = require('express');
const router = express.Router();
const { createPago } = require('../controllers/pagosController');

router.post('/', createPago);

module.exports = router;
