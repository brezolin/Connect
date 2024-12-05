const Community = require('../models/Community');
const UserCommunity = require('../models/UserCommunity');
const Post = require('../models/Post'); 
const { User } = require('../models');

exports.createCommunity = async (req, res) => {
  try {
    const { name, type, description, associatedGame, creatorId } = req.body;

    const community = await Community.create({
      name,
      type,
      description,
      associatedGame,
      creatorId,
    });

    res.status(201).json(community);
  } catch (error) {
    console.error('Erro ao criar comunidade:', error.message);
    res.status(500).json({ error: 'Erro ao criar comunidade.' });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll();
    res.status(200).json(communities);
  } catch (error) {
    console.error('Erro ao obter comunidades:', error.message);
    res.status(500).json({ error: 'Erro ao obter comunidades.' });
  }
};



exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca a comunidade com os relacionamentos
    const community = await Community.findByPk(id, {
      include: [
        {
          model: Post,
          as: 'posts',
        },
        {
          model: User,
          as: 'members',
          through: { attributes: [] }, // Não retorna os atributos da tabela intermediária
        },
        {
          model: User,
          as: 'creator',
        },
      ],
    });

    if (!community) {
      return res.status(404).json({ error: 'Comunidade não encontrada.' });
    }

    res.status(200).json(community);
  } catch (error) {
    console.error('Erro ao carregar a comunidade:', error.message);
    res.status(500).json({ error: 'Erro ao carregar a comunidade.' });
  }
};



exports.joinCommunity = async (req, res) => {
  try {
    const { id: communityId } = req.params;
    const userId = req.user.id;

    if (!communityId || !userId) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const [membership, created] = await UserCommunity.findOrCreate({
      where: { userId, communityId },
    });

    if (created) {
      return res.status(200).json({ message: 'Você entrou na comunidade.' });
    }

    res.status(400).json({ message: 'Você já é membro desta comunidade.' });
  } catch (error) {
    console.error('Erro ao salvar associação no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao salvar associação no banco de dados.' });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description, associatedGame } = req.body;

    const community = await Community.findByPk(id);

    if (!community) {
      return res.status(404).json({ error: 'Comunidade não encontrada.' });
    }

    await community.update({ name, type, description, associatedGame });

    res.status(200).json(community);
  } catch (error) {
    console.error('Erro ao atualizar comunidade:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar comunidade.' });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findByPk(id);

    if (!community) {
      return res.status(404).json({ error: 'Comunidade não encontrada.' });
    }

    await community.destroy();

    res.status(200).json({ message: 'Comunidade excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir comunidade:', error.message);
    res.status(500).json({ error: 'Erro ao excluir comunidade.' });
  }
};
