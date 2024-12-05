const express = require('express');
const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  updateCommunity,
  deleteCommunity,
} = require('../controllers/communityController');

const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

// Proteger todas as rotas com autenticação
router.use(isAuthenticated);

// Rotas de Comunidades
router.post('/create', createCommunity);
router.get('/', getCommunities);
router.get('/:id', getCommunityById);
router.post('/:id/join', joinCommunity);
router.put('/:id', updateCommunity);
router.delete('/:id', deleteCommunity);


module.exports = router;
