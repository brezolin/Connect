const axios = require('axios');

// Buscar lançamentos futuros
const getUpcomingGames = async (req, res) => {
  const RAWG_API_KEY = process.env.RAWG_API_KEY; // Certifique-se de definir a chave no .env

  try {
    // Data atual e fim do próximo mês
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthEnd = nextMonth.toISOString().split('T')[0];

    // Fazendo requisição à API da RAWG
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        dates: `${today},${nextMonthEnd}`, // Lançamentos de hoje até o final do próximo mês
        ordering: 'released', // Ordena por data de lançamento
        page_size: 20, // Número de jogos retornados
      },
    });

    // Processar os dados recebidos
    const releases = response.data.results.map((game) => ({
      id: game.id,
      title: game.name,
      image: game.background_image,
      released: game.released,
      genres: game.genres.map((genre) => genre.name).join(', '), // Concatena gêneros
      platforms: game.platforms
        .map((platform) => platform.platform.name)
        .join(', '), // Concatena plataformas
      tags: [], // Você pode adicionar lógica para tags se necessário
    }));

    // Responder com os lançamentos formatados
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
