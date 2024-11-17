const Platform = require('../models/Platform');
const User = require('../models/User');

// Adicionar uma plataforma ao usuário
const addPlatformToUser = async (req, res) => {
  const { platform } = req.body;
  const userId = req.params.id;

  if (!platform) {
    return res.status(400).json({ error: 'Plataforma é obrigatória.' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const platformData = await Platform.findOne({ where: { name: platform } });
    if (!platformData) {
      return res.status(404).json({ error: 'Plataforma não encontrada.' });
    }

    const userPlatforms = user.platforms || [];
    if (userPlatforms.includes(platformData.id)) {
      return res.status(400).json({ error: 'Plataforma já adicionada ao usuário.' });
    }

    userPlatforms.push(platformData.id);
    await User.update({ platforms: userPlatforms }, { where: { id: userId } });

    res.status(200).json({ message: 'Plataforma adicionada com sucesso.', platforms: userPlatforms });
  } catch (error) {
    console.error('Erro ao adicionar plataforma:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar plataforma.' });
  }
};

// Listar todas as plataformas
const listAllPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.findAll();
    res.status(200).json(platforms);
  } catch (error) {
    console.error('Erro ao buscar plataformas:', error.message);
    res.status(500).json({ error: 'Erro ao buscar plataformas.' });
  }
};

module.exports = {
  addPlatformToUser,
  listAllPlatforms,
};
