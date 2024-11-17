const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize =new Sequelize('gameconnect', 'root', '0000', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conectado ao MySQL com Sucesso!!'))
  .catch((error) => console.error('Erro ao conectar ao MySQL:', error));

module.exports = sequelize;
