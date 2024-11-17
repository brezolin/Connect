const express = require('express');
const { addPlatformToUser, listAllPlatforms } = require('../controllers/platformController');
const router = express.Router();

// Rota para listar todas as plataformas
router.get('/', listAllPlatforms);

// Rota para adicionar plataforma ao usuário
router.post('/user/:id', addPlatformToUser);

module.exports = router;
