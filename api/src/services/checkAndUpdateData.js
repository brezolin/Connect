const Game = require('../models/Games');
const updateGameData = require('./updateGameData'); // Função para buscar e salvar dados

async function checkAndUpdateData() {
  try {
    const count = await Game.count();

    if (count > 0) {
      console.log(`Banco já possui ${count} registros. Nenhuma atualização necessária.`);
      return;
    }

    console.log('Banco vazio. Atualizando dados...');
    await updateGameData();
  } catch (error) {
    console.error('Erro ao verificar ou atualizar dados:', error.message);
  }
}

module.exports = checkAndUpdateData;
