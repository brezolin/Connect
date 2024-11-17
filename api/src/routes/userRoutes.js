const express = require('express');
const {
  getUserProfile,
  addPlatformToUser,
  addGameToUser,
  removePlatformFromUser,
  removeGameFromUser,
} = require('../controllers/userController');
const router = express.Router();

// Rota para buscar perfil do usuário
router.get('/:id', getUserProfile);

// Rota para adicionar uma plataforma ao usuário
router.post('/:id/platforms', addPlatformToUser);

// Rota para remover uma plataforma do usuário
router.delete('/:id/platforms', removePlatformFromUser);

// Rota para adicionar um jogo favorito ao usuário
router.post('/:id/games', addGameToUser);

// Rota para remover um jogo favorito do usuário
router.delete('/:id/games', removeGameFromUser);

module.exports = router;
