const datosMadreService = require('../Services/datosMadreService');

const crearDatosMadre = async (req, res) => {
  try {
    const datos = req.body;
    const resultado = await datosMadreService.crearDatosMadre(datos);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear datos de la madre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerDatosMadre = async (req, res) => {
  try {
    const datos = await datosMadreService.obtenerDatosMadre();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener datos madre:', error);
    res.status(500).json({ error: 'Error al obtener datos madre' });
  }
};

const obtenerDatosMadrePorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await datosMadreService.obtenerDatosMadrePorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener datos de la madre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarDatosMadre = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await datosMadreService.actualizarDatosMadre(id, datos);
    res.status(200).json({ mensaje: 'Datos de la madre actualizados' });
  } catch (error) {
    console.error('Error al actualizar datos de la madre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarDatosMadre = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await datosMadreService.eliminarDatosMadre(id);
    res.status(200).json({ mensaje: 'Datos de la madre eliminados' });
  } catch (error) {
    console.error('Error al eliminar datos de la madre:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearDatosMadre,
  obtenerDatosMadre,
  obtenerDatosMadrePorId,
  actualizarDatosMadre,
  eliminarDatosMadre
};
