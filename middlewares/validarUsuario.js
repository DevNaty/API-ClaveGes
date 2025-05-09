const { check } = require('express-validator');
const { sql, poolPromise } = require('../db');

const validarUsuarioPut = [
  check('Nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  check('Apellido').optional().notEmpty().withMessage('El apellido no puede estar vacío'),
  check('Telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío'),
  check('Email').optional().isEmail().withMessage('Debe ser un email válido'),
  check('Password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('Dni').optional().notEmpty().withMessage('El DNI no puede estar vacío')
    .notEmpty().withMessage('El DNI es obligatorio')
    .custom(async (value, { req }) => {
      const idUsuario = req.params.id;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('dni', sql.VarChar, value)
        .query('SELECT ID_USUARIO FROM USUARIOS WHERE Dni = @dni');

      if (result.recordset.length > 0 && result.recordset[0].ID_USUARIO != idUsuario) {
        throw new Error('Ya existe un usuario con ese DNI');
      }

      return true;
    }),
];

module.exports = { validarUsuarioPut };
