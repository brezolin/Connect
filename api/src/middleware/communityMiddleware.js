const UserCommunity = require('../models/UserCommunity');

const isMember = async (req, res, next) => {
  const { id: communityId } = req.params; // Corrigido para `id`
  const userId = req.user.id;

  try {
    const membership = await UserCommunity.findOne({
      where: {
        userId,
        communityId,
      },
    });

    if (!membership) {
      return res.status(403).json({ error: 'Você não é membro desta comunidade.' });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { isMember };
