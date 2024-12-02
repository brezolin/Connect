const axios = require('axios');

module.exports = {
  async getGameNews(req, res) {
    const RAWG_API_KEY = process.env.RAWG_API_KEY;
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    try {
      const gamesResponse = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key: RAWG_API_KEY,
          page_size: 10,
          ordering: '-rating',
          dates: `${new Date().getFullYear() - 1}-01-01,${new Date().toISOString().split('T')[0]}`,
        },
      });

      const games = await Promise.all(
        gamesResponse.data.results
          .filter((game) => game.reviews_count >= 2 && game.rating >= 3.0) // Ajuste o critério de relevância
          .map(async (game) => {
            try {
              const youtubeResponse = await axios.get(
                'https://www.googleapis.com/youtube/v3/search',
                {
                  params: {
                    part: 'snippet',
                    q: `${game.name} trailer`,
                    maxResults: 1,
                    type: 'video',
                    key: YOUTUBE_API_KEY,
                  },
                }
              );

              const trailerData = youtubeResponse.data.items[0];
              const trailer = trailerData
                ? `https://www.youtube.com/watch?v=${trailerData.id.videoId}`
                : null;

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
            } catch (error) {
              console.error(`Erro ao buscar trailer para o jogo ${game.name}:`, error.message);
              return null;
            }
          })
      );

      res.status(200).json(games.filter(Boolean));
    } catch (error) {
      console.error('Erro ao buscar jogos com trailers:', error);
      res.status(500).json({ error: 'Erro ao buscar jogos com trailers.' });
    }
  },
};
