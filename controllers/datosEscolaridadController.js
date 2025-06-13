const datosEscolaridadService = require('../Services/datosEscolaridadService');

const crearDatosEscolaridad = async (req, res) => {
  try {
    const datos = req.body;
    const resultado = await datosEscolaridadService.crearDatosEscolaridad(datos);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear datos de escolaridad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerDatosEscolaridad = async (req, res) => {
  try {
    const datos = await datosEscolaridadService.obtenerDatosEscolaridad();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener datos de escolaridad:', error);
    res.status(500).json({ error: 'Error al obtener datos de escolaridad' });
  }
};

const obtenerDatosEscolaridadPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await datosEscolaridadService.obtenerDatosEscolaridadPorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener datos de escolaridad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarDatosEscolaridad = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await datosEscolaridadService.actualizarDatosEscolaridad(id, datos);
    res.status(200).json({ mensaje: 'Datos de escolaridad actualizados' });
  } catch (error) {
    console.error('Error al actualizar datos de escolaridad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarDatosEscolaridad = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await datosEscolaridadService.eliminarDatosEscolaridad(id);
    res.status(200).json({ mensaje: 'Datos de escolaridad eliminados' });
  } catch (error) {
    console.error('Error al eliminar datos de escolaridad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearDatosEscolaridad,
  obtenerDatosEscolaridad,
  obtenerDatosEscolaridadPorId,
  actualizarDatosEscolaridad,
  eliminarDatosEscolaridad
};
