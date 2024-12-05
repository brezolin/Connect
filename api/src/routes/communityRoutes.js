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
const isAuthenticated = require('../middleware/authMiddleware');
const { isMember } = require('../middleware/communityMiddleware');

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

// Rotas de Posts
router.post('/:id/posts', isMember, createPost);
router.get('/:id/posts', getPostsByCommunity);
router.put('/posts/:postId', isMember, updatePost);
router.delete('/posts/:postId', isMember, deletePost);

module.exports = router;
