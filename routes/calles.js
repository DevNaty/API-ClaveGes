const express = require('express');
const router = express.Router();
const callesController = require('../controllers/callesController');

// Rutas
router.get('/', callesController.getCalles);
router.get('/:id', callesController.getCalleById);
router.post('/', callesController.createCalle);
router.put('/:id', callesController.updateCalle);
router.delete('/:id', callesController.deleteCalle);

module.exports = router;
