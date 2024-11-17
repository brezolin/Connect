

const axios = require('axios');

const rawgApi = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: process.env.RAWG_API_KEY, // Use a chave da API definida no .env
  },
});

const fetchGames = async () => {
  try {
    const response = await rawgApi.get('/games', {
      params: {
        ordering: '-rating', // Ordenar por jogos mais bem avaliados
        page_size: 10, // Limitar a 10 jogos por requisição
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error.message);
    throw new Error('Erro ao buscar dados da RAWG API.');
  }
};

module.exports = { fetchGames };
