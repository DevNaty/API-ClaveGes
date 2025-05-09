const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const token = req.header('x-token'); // El token se manda por el header

  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'claveSecreta123');
    req.usuario = payload; // Guardamos la info del usuario en la request
    next(); // Continúa con la ruta
  } catch (err) {
    console.error('❌ Token inválido:', err);
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = validarJWT;
