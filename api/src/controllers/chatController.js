const { Op } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User'); // Modelo de usuários
module.exports = {
  async sendMessage(req, res) {
    const { senderId, receiverId, content } = req.body;
  
    try {
      const newMessage = await Message.create({ senderId, receiverId, content });
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      res.status(500).json({ error: 'Erro ao enviar mensagem.', details: error.message });
    }
  },
  

  async getMessages(req, res) {
    const { user1, user2 } = req.params;
  
    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 },
          ],
        },
        order: [['createdAt', 'ASC']], // Use camelCase aqui também
      });
      res.status(200).json(messages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      res.status(500).json({ error: 'Erro ao carregar mensagens.', details: error.message });
    }
  },
  
  async getConversations(req, res) {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'ID do usuário inválido.' });
    }

    try {
      // Buscar mensagens relacionadas ao usuário
      const conversations = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        attributes: ['senderId', 'receiverId'], // Apenas IDs para evitar sobrecarga
        group: ['senderId', 'receiverId'], // Evitar duplicados
      });

      const friendIds = new Set();
      conversations.forEach((msg) => {
        const friendId =
          msg.senderId === parseInt(userId) ? msg.receiverId : msg.senderId;
        friendIds.add(friendId);
      });

      // Buscar os detalhes dos amigos
      const friends = await User.findAll({
        where: { id: [...friendIds] },
        attributes: ['id', 'username'], // Retorna apenas os campos necessários
      });

      res.status(200).json(friends);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      res.status(500).json({ error: 'Erro ao buscar conversas.' });
    }
  },


  async deleteMessage(req, res) {
    const { messageId } = req.params;
  
    if (!messageId) {
      return res.status(400).json({ error: 'ID da mensagem é obrigatório.' });
    }
  
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Mensagem não encontrada.' });
      }
  
      await message.destroy();
      res.status(200).json({ message: 'Mensagem excluída com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      res.status(500).json({ error: 'Erro ao excluir mensagem.' });
    }
  },

  async deleteConversation(req, res) {
    const { user1, user2 } = req.params;
  
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'IDs dos usuários são obrigatórios.' });
    }
  
    try {
      await Message.destroy({
        where: {
          [Op.or]: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 },
          ],
        },
      });
  
      res.status(200).json({ message: 'Conversa excluída com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
      res.status(500).json({ error: 'Erro ao excluir conversa.' });
    }
  },

  async getNotifications(req, res) {
    const { userId } = req.params;

    try {
      const unreadMessages = await Message.count({
        where: {
          receiverId: userId,
          isRead: false, // Supondo que exista um campo `isRead` no modelo
        },
      });

      res.status(200).json({ total: unreadMessages });
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({ error: 'Erro ao buscar notificações.' });
    }
  },

  async clearNotifications(req, res) {
    const { userId, friendId } = req.body;
  
    try {
      await Message.update(
        { isRead: true }, // Supondo que o modelo `Message` tenha o campo `isRead`
        {
          where: {
            receiverId: userId,
            senderId: friendId,
            isRead: false,
          },
        }
      );
  
      res.status(200).json({ message: 'Notificações limpas com sucesso.' });
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
      res.status(500).json({ error: 'Erro ao limpar notificações.' });
    }
  }
  
  

  
};
