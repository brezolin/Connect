const Community = require('../models/Community');

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
    const community = await Community.findByPk(id);

    if (!community) {
      return res.status(404).json({ error: 'Comunidade não encontrada.' });
    }

    res.status(200).json(community);
  } catch (error) {
    console.error('Erro ao obter comunidade:', error.message);
    res.status(500).json({ error: 'Erro ao obter comunidade.' });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Lógica para adicionar o usuário como membro da comunidade
    // (Adicionar à lista de membros ou tabela de associação)

    res.status(200).json({ message: 'Você entrou na comunidade.' });
  } catch (error) {
    console.error('Erro ao entrar na comunidade:', error.message);
    res.status(500).json({ error: 'Erro ao entrar na comunidade.' });
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
