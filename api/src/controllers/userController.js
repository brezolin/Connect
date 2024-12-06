const User = require('../models/User');
const Platform = require('../models/Platform');
const axios = require('axios');
const { Op } = require('sequelize');

const rawgApi = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: process.env.RAWG_API_KEY, // Sua chave RAWG no .env
  },
});

// Buscar o perfil do usuário
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const userPlatforms = user.platforms || [];
    const userFavoriteGames = user.favorite_games || [];

    // Buscar plataformas associadas
    const platforms = await Platform.findAll({
      where: {
        id: userPlatforms,
      },
    });

    // Buscar informações dos jogos favoritos
    const favoriteGamesWithImages = await Promise.all(
      userFavoriteGames.map(async (game) => {
        try {
          const response = await rawgApi.get('/games', {
            params: { search: game, page_size: 1 },
          });

          const gameData = response.data.results[0];
          return {
            name: game,
            image: gameData ? gameData.background_image : '/images/default_game.png',
          };
        } catch (error) {
          console.error(`Erro ao buscar dados do jogo ${game}:`, error.message);
          return { name: game, image: '/images/default_game.png' };
        }
      })
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      platforms: platforms.map((platform) => ({
        name: platform.name,
        image_url: platform.image_url,
      })),
      favorite_games: favoriteGamesWithImages,
      friends: user.friends, // Retornar os amigos sem as informações de nome, email e ID
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dados do servidor.' });
  }
};

// Adicionar uma nova plataforma
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

    res.status(200).json({ platform: { name: platformData.name, image_url: platformData.image_url } });
  } catch (error) {
    console.error('Erro ao adicionar plataforma:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar plataforma.' });
  }
};

// Adicionar um jogo favorito ao usuário
const addGameToUser = async (req, res) => {
  const { game } = req.body; // Nome do jogo enviado no corpo da requisição
  const userId = req.params.id;

  if (!game) {
    return res.status(400).json({ error: 'O nome do jogo é obrigatório.' });
  }

  try {
    // Buscar o usuário pelo ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Buscar o jogo na API RAWG para obter a imagem e detalhes
    const response = await rawgApi.get('/games', {
      params: { search: game, page_size: 1 },
    });

    const gameData = response.data.results[0]; // Primeiro resultado da busca
    if (!gameData) {
      return res.status(404).json({ error: 'Jogo não encontrado na API.' });
    }

    // Atualizar os jogos favoritos do usuário
    const favoriteGames = user.favorite_games || [];
    if (favoriteGames.includes(gameData.name)) {
      return res.status(400).json({ error: 'Jogo já adicionado aos favoritos.' });
    }

    favoriteGames.push(gameData.name);
    await User.update({ favorite_games: favoriteGames }, { where: { id: userId } });

    res.status(200).json({
      message: 'Jogo adicionado com sucesso.',
      game: { name: gameData.name, image: gameData.background_image },
    });
  } catch (error) {
    console.error('Erro ao adicionar jogo:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar jogo.' });
  }
};

// Remover uma plataforma do usuário
const removePlatformFromUser = async (req, res) => {
  const { platform } = req.body; // Nome da plataforma enviado no corpo da requisição
  const userId = req.params.id;

  if (!platform) {
    return res.status(400).json({ error: 'O nome da plataforma é obrigatório.' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const userPlatforms = user.platforms || [];
    const platformData = await Platform.findOne({ where: { name: platform } });

    if (!platformData || !userPlatforms.includes(platformData.id)) {
      return res.status(400).json({ error: 'Plataforma não associada ao usuário.' });
    }

    const updatedPlatforms = userPlatforms.filter((id) => id !== platformData.id);
    await User.update({ platforms: updatedPlatforms }, { where: { id: userId } });

    res.status(200).json({ message: 'Plataforma removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover plataforma:', error.message);
    res.status(500).json({ error: 'Erro ao remover plataforma.' });
  }
};

// Remover um jogo favorito do usuário
const removeGameFromUser = async (req, res) => {
  const { game } = req.body; // Nome do jogo enviado no corpo da requisição
  const userId = req.params.id;

  if (!game) {
    return res.status(400).json({ error: 'O nome do jogo é obrigatório.' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const favoriteGames = user.favorite_games || [];
    if (!favoriteGames.includes(game)) {
      return res.status(400).json({ error: 'Jogo não associado ao usuário.' });
    }

    const updatedGames = favoriteGames.filter((name) => name !== game);
    await User.update({ favorite_games: updatedGames }, { where: { id: userId } });

    res.status(200).json({ message: 'Jogo removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover jogo:', error.message);
    res.status(500).json({ error: 'Erro ao remover jogo.' });
  }
};

const addFriends = async (req, res) => {
  const userId = req.params.id;
  const { friendId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const friend = await User.findByPk(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: 'Usuário ou amigo não encontrado.' });
    }

    const userFriends = user.friends || [];
    if (userFriends.includes(friendId)) {
      return res.status(400).json({ error: 'Amigo já adicionado.' });
    }

    userFriends.push(friendId);
    await User.update({ friends: userFriends }, { where: { id: userId } });

    res.status(200).json({ message: 'Amigo adicionado com sucesso.', friends: userFriends });
  } catch (error) {
    console.error('Erro ao adicionar amigo:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar amigo.' });
  }
};


const getUserFriends = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const friendsIds = user.friends || [];
    const friends = await User.findAll({
      where: {
        id: friendsIds,
      },
      attributes: ['id', 'username'],
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error('Erro ao buscar amigos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar amigos.' });
  }
};


const buscaFriends = async (req, res) => {
  const { query } = req.query;

  // Validação do termo de busca
  if (!query || query.trim() === '') {
    return res.status(400).json({
      error: 'A busca requer um termo válido.',
      details: 'O termo de busca não pode estar vazio.',
    });
  }

  try {
    // Busca usuários por username ou email usando LIKE
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ['id', 'username', 'email'], // Retorna apenas os campos necessários
      limit: 50, // Limite de resultados
      order: [['username', 'ASC']], // Ordena pelo username
    });

    // Caso nenhum usuário seja encontrado
    if (users.length === 0) {
      return res.status(404).json({
        message: 'Nenhum usuário encontrado.',
        query: query,
      });
    }

    res.status(200).json({
      total: users.length,
      users: users,
    });
  } catch (error) {
    console.error('Erro detalhado na busca de usuários:', error);

    res.status(500).json({
      error: 'Erro interno ao processar a busca de usuários',
      errorMessage: error.message,
    });
  }
};

const buscaTodosUsuarios = async (req, res) => {
  try {
    // Busca todos os usuários no banco de dados
    const users = await User.findAll({
      attributes: ['id', 'username', 'email'], // Retorna apenas os campos necessários
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  };
};

const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id; // Obtém o ID do usuário autenticado
    const user = await User.findByPk(userId);
    console.log(user)
    const profilePicturePath = `images/${req.file.filename}`;
    await User.update({ profilePicture: profilePicturePath }, { where: { id: userId } });

  console.log('Caminho da imagem:', profilePicturePath);


    if (!profilePicturePath) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    // Atualiza o caminho da foto no banco de dados
    await User.update({ profilePicture: profilePicturePath }, { where: { id: userId } });

    res.status(200).json({ message: 'Foto de perfil atualizada com sucesso.', profilePicture: profilePicturePath });
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar foto de perfil.' });
  }
};


module.exports = {
  removePlatformFromUser,
  removeGameFromUser,
  getUserProfile,
  addPlatformToUser,
  addGameToUser, 
  getUserFriends,
  addFriends,
  buscaFriends,
  buscaTodosUsuarios,
  updateProfilePicture,
};

