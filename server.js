const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const migracionPassword = require('./routes/migracionPassword');
const categoriasRoutes = require('./routes/categorias');
const asignacionesDocentesRoutes = require('./routes/asignacionesDocentes');
const callesRoutes = require('./routes/calles');
const cargaHorariaRoutes = require('./routes/cargaHoraria');
const ciclosRoutes = require('./routes/ciclos');
const estadosRoutes = require('./routes/estados');
const escuelasRoutes = require('./routes/escuelas');
const gradodeestudiosRoutes = require('./routes/gradodeestudios');
const gradosescolaresRoutes = require('./routes/gradosescolares');
const instrumentosRoutes = require('./routes/instrumentos');
const formacionesRoutes = require('./routes/formaciones');
const nacionalidadesRoutes = require('./routes/nacionalidades');
const nivelesAcademicosRoutes = require('./routes/nivelesAcademicos');
const nivelesRoutes = require('./routes/niveles');
const localidadesRoutes = require('./routes/localidades');
const tiposDeHorasRoutes = require('./routes/tiposDeHoras');
const turnosEscolaresRoutes = require('./routes/turnosEscolares');
const espaciosCurricularesRoutes = require('./routes/espaciosCurriculares');
const datosInscripcionesRoutes = require('./routes/datosInscripciones');
const permisosRoutes = require('./routes/permisos');
const vinculosRoutes = require('./routes/vinculos');
const ocupacionesRoutes = require('./routes/ocupaciones');
const datosAlumnosRoutes = require('./routes/datosAlumnos');
const datosMadreRoutes = require('./routes/datosMadre');
const datosPadreRoutes = require('./routes/datosPadre');
const datosTutorRoutes = require('./routes/datosTutor');
const datosEscolaridadRoutes = require('./routes/datosEscolaridad');
const ocupacionesVinculosRoutes = require('./routes/ocupacionesVinculos');
const matriculaDetRoutes = require('./routes/matriculaDet');
const instrumentosDetallesRoutes = require('./routes/instrumentosDetalles');
//const validarUsuario = require('./validator/usuarioValidator'); 
//const { validarUsuarioPut } = require('../middlewares/validarUsuario');
//const { validarCampos } = require('./middlewares/validarCampos');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());
// Usamos las rutas
app.use('/api/login', authRoutes);
app.use('/api/usuarios', usuariosRoutes); 
app.use('/migracion', migracionPassword);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/calles', callesRoutes);
app.use('/api/cargaHoraria', cargaHorariaRoutes);
app.use('/api/ciclos', ciclosRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api/escuelas', escuelasRoutes);
app.use('/api/gradodeestudios', gradodeestudiosRoutes);
app.use('/api/gradosescolares', gradosescolaresRoutes);
app.use('/api/instrumentos', instrumentosRoutes);
app.use('/api/formaciones', formacionesRoutes);
app.use('/api/nacionalidades', nacionalidadesRoutes);
app.use('/api/nivelesAcademicos', nivelesAcademicosRoutes);
app.use('/api/niveles', nivelesRoutes);
app.use('/api/localidades', localidadesRoutes);
app.use('/api/turnosEscolares', turnosEscolaresRoutes);
app.use('/api/tiposDeHoras', tiposDeHorasRoutes);
app.use('/api/espaciosCurriculares', espaciosCurricularesRoutes);
app.use('/api/asignacionesDocentes', asignacionesDocentesRoutes);
app.use('/api/datosInscripciones', datosInscripcionesRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/vinculos', vinculosRoutes);
app.use('/api/ocupaciones', ocupacionesRoutes);
app.use('/api/datosAlumnos', datosAlumnosRoutes);
app.use('/api/datosMadre', datosMadreRoutes);
app.use('/api/datosPadre', datosPadreRoutes);
app.use('/api/datosTutor', datosTutorRoutes);
app.use('/api/datosEscolaridad', datosEscolaridadRoutes);
app.use('/api/ocupacionesVinculos', ocupacionesVinculosRoutes);
app.use('/api/matriculaDet', matriculaDetRoutes);
app.use('/api/instrumentosDetalles', instrumentosDetallesRoutes);

// Conexión inicial a la base de datos
const { poolPromise } = require('./db');
poolPromise
  .then(() => {
    console.log('✅ Conexión inicial lista');
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos:', err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
