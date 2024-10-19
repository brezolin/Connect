const express = require('express');
const { registerUser } = require('../controllers/userController');
const router = express.Router();

// Rota de cadastro de usuário
router.post('/register', registerUser);

module.exports = router;
