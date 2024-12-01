
const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
};

const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await Message.create({ senderId, receiverId, content });
    res.status(201).json(message);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem.' });
  }
};

module.exports = { getMessages, sendMessage };
