const jwt = require('jsonwebtoken');
const secretKey = 'seu_segredo_jwt';

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado!' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido!' });
  }
};

module.exports = verifyToken;
