const ocupacionesVinculosService = require('../Services/ocupacionesVinculosService');

const crearOcupacionVinculo = async (req, res) => {
  try {
    const datos = req.body;
    const nuevoId = await ocupacionesVinculosService.crearOcupacionVinculo(datos);
    res.status(201).json({ ID_OcupacionVinculo: nuevoId });
  } catch (error) {
    console.error('Error al crear Ocupación-Vínculo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerTodos = async (req, res) => {
  try {
    const lista = await ocupacionesVinculosService.obtenerTodos();
    res.status(200).json(lista);
  } catch (error) {
    console.error('Error al obtener ocupaciones-vínculos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await ocupacionesVinculosService.obtenerPorId(id);
    res.status(200).json(item);
  } catch (error) {
    console.error('Error al obtener ocupación-vínculo por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const actualizarOcupacionVinculo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await ocupacionesVinculosService.actualizarOcupacionVinculo(id, datos);
    res.status(200).json({ mensaje: 'Ocupación-Vínculo actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar Ocupación-Vínculo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const eliminarOcupacionVinculo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await ocupacionesVinculosService.eliminarOcupacionVinculo(id);
    res.status(200).json({ mensaje: 'Ocupación-vínculo eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar ocupación-vínculo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearOcupacionVinculo,
  obtenerTodos,
  obtenerPorId,
  actualizarOcupacionVinculo,
  eliminarOcupacionVinculo
};
