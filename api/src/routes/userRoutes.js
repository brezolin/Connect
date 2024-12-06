const express = require('express');
const upload = require('../middleware/multerConfig');
const {
  getUserProfile,
  addPlatformToUser,
  addGameToUser,
  removePlatformFromUser,
  removeGameFromUser,
  getUserFriends,
  addFriends,
  buscaFriends,
  buscaTodosUsuarios,
  updateProfilePicture,
  removeFriend
  
} = require('../controllers/userController');
const router = express.Router();

const isAuthenticated = require('../middleware/authMiddleware');


// Proteger todas as rotas com autenticação
router.use(isAuthenticated);


// Rotas específicas (fixas) devem vir primeiro
router.get('/search', buscaFriends); // Buscar usuários
router.get('/all', buscaTodosUsuarios); // Buscar todos os usuários

// Rotas dinâmicas (genéricas) devem vir depois
router.get('/:id', getUserProfile); // Buscar perfil do usuário
router.post('/:id/platforms', addPlatformToUser); // Adicionar plataforma
router.delete('/:id/platforms', removePlatformFromUser); // Remover plataforma
router.post('/:id/games', addGameToUser); // Adicionar jogo favorito
router.delete('/:id/games', removeGameFromUser); // Remover jogo favorito
router.get('/:id/friends', getUserFriends); // Buscar amigos do usuário
router.post('/:id/friends', addFriends); // Adicionar amigo
router.delete('/:id/removeFriend', removeFriend);
router.post('/profile-picture', upload.single('profilePicture'), updateProfilePicture);

module.exports = router;
