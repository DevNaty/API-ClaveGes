const datosAlumnosService = require('../Services/datosAlumnosService');
console.log('Datos Alumnos Service:');

const crearDatosAlumno = async (req, res) => {
  try {
    const datos = req.body;
    const resultado = await datosAlumnosService.crearDatosAlumno(datos);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear datos del alumno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const obtenerDatosAlumno = async (req, res) => {
  try {
    const datos = await datosAlumnosService.obtenerDatosAlumno();
    res.json(datos);
    console.log('Datos de alumnos obtenidos correctamente');
  } catch (error) {
    console.error('❌ Error al obtener datos del alumno:', error);
    res.status(500).json({ error: 'Error al obtener datos del alumno' });
  }
};

const obtenerDatosAlumnoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resultado = await datosAlumnosService.obtenerDatosAlumnoPorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener datos del alumno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarDatosAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    await datosAlumnosService.actualizarDatosAlumno(id, datos);
    res.status(200).json({ mensaje: 'Datos del alumno actualizados' });
  } catch (error) {
    console.error('Error al actualizar datos del alumno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarDatosAlumno = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await datosAlumnosService.eliminarDatosAlumno(id);
    res.status(200).json({ mensaje: 'Datos del alumno eliminados' });
  } catch (error) {
    console.error('Error al eliminar datos del alumno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearDatosAlumno,
  obtenerDatosAlumno,
  obtenerDatosAlumnoPorId,
  actualizarDatosAlumno,
  eliminarDatosAlumno
};
