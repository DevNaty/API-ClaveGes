const express = require('express');
const router = express.Router();
const datosMadreController = require('../controllers/datosMadreController');

router.post('/', datosMadreController.crearDatosMadre);
router.get('/', datosMadreController.obtenerDatosMadre);
router.get('/:id', datosMadreController.obtenerDatosMadrePorId);
router.put('/:id', datosMadreController.actualizarDatosMadre);
router.delete('/:id', datosMadreController.eliminarDatosMadre);

module.exports = router;
