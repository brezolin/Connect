const User = require('../models/User');
const Platform = require('../models/Platform');
const axios = require('axios');

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
      platforms: platforms.map((platform) => ({
        name: platform.name,
        image_url: platform.image_url,
      })),
      favorite_games: favoriteGamesWithImages,
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


module.exports = {
  removePlatformFromUser,
  removeGameFromUser,
  getUserProfile,
  addPlatformToUser,
  addGameToUser, 
};

