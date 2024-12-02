const Game = require('../models/Games'); // Caminho para o modelo do Sequelize

module.exports = {
  async getGameNews(req, res) {
    try {
      // Busca todos os jogos, ordenando pelo campo `updatedAt`
      const games = await Game.findAll({
        order: [['updatedAt', 'DESC']],
      });

      res.json(games);
    } catch (error) {
      console.error('Erro ao buscar dados:', error.message);
      res.status(500).json({ error: 'Erro ao buscar dados.' });
    }
  },
};
