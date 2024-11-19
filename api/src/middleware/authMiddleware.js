
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Decodifica e anexa os dados ao request
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    res.status(401).json({ error: message });
  }
};

module.exports = isAuthenticated;
