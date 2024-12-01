
const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const router = express.Router();

// Rota para buscar mensagens entre dois usuários
router.get('/:userId/:otherUserId', getMessages);

// Rota para enviar uma mensagem
router.post('/', sendMessage);

module.exports = router;
