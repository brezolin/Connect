const express = require('express');
const { fetchGames } = require('../services/rawgService');
const router = express.Router();

const axios = require('axios');


const rawgApi = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: process.env.RAWG_API_KEY, // Chave da RAWG no .env
  },
});


router.get('/games', async (req, res) => {
  try {
    const games = await fetchGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}),


// Endpoint para buscar jogos
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Termo de pesquisa é obrigatório.' });
  }

  try {
    const response = await rawgApi.get('/games', {
      params: { search: query, page_size: 5 }, // Retorna os 5 primeiros resultados
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
});

module.exports = router;
