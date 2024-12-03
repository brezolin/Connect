const express = require('express');
const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  updateCommunity,
  deleteCommunity,
} = require('../controllers/communityController');

const {
  createPost,
  getPostsByCommunity,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

// Rotas de Comunidade
router.post('/create', createCommunity);
router.get('/', getCommunities);
router.get('/:id', getCommunityById);
router.post('/:id/join', joinCommunity);
router.put('/:id', updateCommunity);
router.delete('/:id', deleteCommunity);

// Rotas de Posts
router.post('/:id/posts', createPost); // Criar um post em uma comunidade
router.get('/:id/posts', getPostsByCommunity); // Obter posts de uma comunidade
router.put('/posts/:postId', updatePost); // Atualizar um post
router.delete('/posts/:postId', deletePost); // Excluir um post

module.exports = router;
