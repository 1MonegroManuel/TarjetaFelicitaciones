const express = require('express');
const router = express.Router();
const { createTarjeta, getTarjetaById, updateTarjeta, deleteTarjeta } = require('../controllers/tarjetasController');

router.post('/', createTarjeta);
router.get('/:id', getTarjetaById);
router.put('/:id', updateTarjeta);
router.delete('/:id', deleteTarjeta);

module.exports = router;
