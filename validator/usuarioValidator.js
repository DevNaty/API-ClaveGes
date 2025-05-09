const { check, body } = require('express-validator');

const { sql, poolPromise } = require('../db');


const validarUsuario = [
  body('Nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('Apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('Telefono').notEmpty().withMessage('El teléfono es obligatorio'),
  body('Email').isEmail().withMessage('Debe ser un email válido'),
  body('Password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('Dni').isNumeric().withMessage('El DNI debe ser numérico'),

  check('Dni')
    .notEmpty().withMessage('El DNI es obligatorio')
    .isLength({ min: 6 }).withMessage('El DNI debe tener al menos 6 dígitos')
    .custom(async (value) => {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('dni', sql.VarChar, value)
        .query('SELECT ID_USUARIO FROM USUARIOS WHERE Dni = @dni');

      if (result.recordset.length > 0) {
        throw new Error('Ya existe un usuario con ese DNI');
      }

      return true;
    }),
];


module.exports = validarUsuario;
