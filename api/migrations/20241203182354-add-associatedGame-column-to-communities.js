'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Communities', 'associatedGame', {
      type: Sequelize.STRING, // Altere para o tipo adequado, se necessário
      allowNull: true, // Se não for obrigatório, defina como true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Communities', 'associatedGame');
  },
};
