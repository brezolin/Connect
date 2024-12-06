const axios = require('axios');
require('dotenv').config();
// Buscar lançamentos futuros
const getUpcomingGames = async (req, res) => {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;

  if (!RAWG_API_KEY) {
    return res.status(500).json({ error: 'Chave da API não configurada.' });
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // Data de hoje
    const endOfJanuary = new Date();
    endOfJanuary.setMonth(0); // Janeiro é mês 0
    endOfJanuary.setFullYear(new Date().getFullYear() + 2); // Ano seguinte
    endOfJanuary.setDate(31); // Último dia de janeiro
    const nextMonthEnd = endOfJanuary.toISOString().split('T')[0];

    console.log(`Buscando jogos de ${today} até ${nextMonthEnd}`);

    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        dates: `${today},${nextMonthEnd}`, // De hoje até o final de janeiro
        ordering: 'released',
        page_size: 15,
      },
    });

    const releases = response.data.results.map((game) => ({
      id: game.id,
      title: game.name,
      image: game.background_image,
      released: game.released,
      genres: game.genres?.map((genre) => genre.name).join(', ') || 'Não especificado',
      platforms: game.platforms?.map((platform) => platform.platform.name).join(', ') || 'Não especificado',
    }));

    res.status(200).json(releases);
  } catch (error) {
    console.error('Erro ao buscar lançamentos futuros:', error.message);
    res.status(500).json({ error: 'Erro ao buscar lançamentos futuros.' });
  }
};

// Buscar jogos por termo de pesquisa
const searchForGames = async (req, res) => {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Termo de pesquisa é obrigatório.' });
  }

  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        search: query,
        page_size: 5, // Retorna os 5 primeiros resultados
      },
    });

    const games = response.data.results.map((game) => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
    }));

    res.status(200).json(games);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar jogos.' });
  }
};

module.exports = { getUpcomingGames, searchForGames };
