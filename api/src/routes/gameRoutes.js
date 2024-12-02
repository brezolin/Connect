const express = require('express');
const { getUpcomingGames, searchForGames } = require('../controllers/gameController');

const router = express.Router();

// Rota para lançamentos futuros
router.get('/upcoming', getUpcomingGames);

// Rota para buscar jogos por termo de pesquisa
router.get('/search', searchForGames);

module.exports = router;
