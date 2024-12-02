
const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Rota para enviar mensagens
router.post('/send', chatController.sendMessage);

// Rota para buscar mensagens

router.get('/conversations/:userId', chatController.getConversations);

// Rota para buscar mensagens entre dois usuários
router.get('/:user1/:user2', chatController.getMessages);

// Rota para deletar uma mensagem
router.delete('/message/:messageId', chatController.deleteMessage);


// Rota para deletar uma conversa
router.delete('/conversation/:user1/:user2', chatController.deleteConversation);

 // Rota para marcar uma mensagem como lida
router.get('/notifications/:userId', chatController.getNotifications);

 // Rota para marcar todas as notificações como lidas
router.post('/clear-notifications', chatController.clearNotifications);

module.exports = router;
