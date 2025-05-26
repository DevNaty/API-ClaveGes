const instrumentosDetallesService = require('../Services/instrumentosDetallesService');

const crearInstrumentoDet = async (req, res) => {
  try {
    const datos = req.body;
    const nuevoId = await instrumentosDetallesService.crearInstrumentoDet(datos);
    res.status(201).json({ ID_DetalleInstrumento: nuevoId });
  } catch (error) {
    console.error('Error al crear Detalle de Instrumento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerInstrumentoDetTodos = async (req, res) => {
  try {
    const lista = await instrumentosDetallesService.obtenerInstrumentoDetTodos();
    res.status(200).json(lista);
  } catch (error) {
    console.error('Error al obtener Detalle de Instrumento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerInstrumentoDetPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await instrumentosDetallesService.obtenerInstrumentoDetPorId(id);
    res.status(200).json(item);
  } catch (error) {
    console.error('Error al obtener Detalle de Instrumento por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const actualizarInstrumentoDet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await instrumentosDetallesService.actualizarInstrumentoDet(id, datos);
    res.status(200).json({ mensaje: 'Detalle de Instrumento actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar Detalle de Instrumento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const eliminarInstrumentoDet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await instrumentosDetallesService.eliminarInstrumentoDet(id);
    res.status(200).json({ mensaje: 'Detalle de Instrumento eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar Detalle de Instrumento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearInstrumentoDet,
  obtenerInstrumentoDetPorId,
  obtenerInstrumentoDetTodos,
  actualizarInstrumentoDet,
  eliminarInstrumentoDet
};
