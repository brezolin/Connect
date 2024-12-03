'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Communities', 'creatorId', {
      type: Sequelize.INTEGER,
      allowNull: false, // Se for obrigatório que cada comunidade tenha um criador
      references: {
        model: 'Users', // Nome da tabela de usuários
        key: 'id', // Chave primária da tabela de usuários
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Communities', 'creatorId');
  },
};
