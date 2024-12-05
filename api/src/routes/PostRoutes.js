const express = require('express');
const isAuthenticated = require('../middleware/authMiddleware');
const { isMember } = require('../middleware/communityMiddleware');

const router = express.Router();

// Proteger todas as rotas com autenticação
router.use(isAuthenticated);



const {
    createPost,
    getPostsByCommunity,
    updatePost,
    deletePost,
  } = require('../controllers/postController');

// Rotas de Posts
router.post('/:communityId/posts', createPost);
// router.get('/:communityId', getPostsByCommunity);
// router.put('/:postId', isMember, updatePost);
// router.delete(':postId', isMember, deletePost);

module.exports = router;