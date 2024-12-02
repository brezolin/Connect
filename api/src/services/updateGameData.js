const axios = require('axios');
const Game = require('../models/Games');

async function updateGameData() {
  const RAWG_API_KEY = process.env.RAWG_API_KEY;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: RAWG_API_KEY,
        page_size: 14,
        ordering: '-rating',
        dates: `${new Date().getFullYear() - 1}-01-01,${new Date().toISOString().split('T')[0]}`,
      },
    });

    const fetchTrailer = async (gameName) => {
      try {
        const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: `${gameName} trailer`,
            maxResults: 1,
            type: 'video',
            key: YOUTUBE_API_KEY,
          },
        });
        const trailerData = youtubeResponse.data.items[0];
        return trailerData ? `https://www.youtube.com/watch?v=${trailerData.id.videoId}` : null;
      } catch (error) {
        console.warn(`Erro ao buscar trailer para ${gameName}: ${error.message}`);
        return null;
      }
    };

    const games = await Promise.all(
      response.data.results.map(async (game) => {
        const trailer = await fetchTrailer(game.name);

        return {
          id: game.id,
          title: game.name,
          description: game.description_raw || 'Descrição não disponível.',
          image: game.background_image,
          released: game.released,
          platforms: game.platforms.map((p) => p.platform.name).join(', '),
          genres: game.genres.map((g) => g.name).join(', '),
          rating: game.rating,
          reviewsCount: game.reviews_count,
          url: `https://rawg.io/games/${game.slug}`,
          trailer,
        };
      })
    );

    await Promise.all(games.map((game) => Game.upsert(game)));

    console.log('Dados atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar os dados dos jogos:', error.message);
  }
}

module.exports = updateGameData;
