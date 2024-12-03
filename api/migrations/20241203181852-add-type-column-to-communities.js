'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Communities', 'type', {
      type: Sequelize.STRING, // ou Sequelize.ENUM caso tenha valores pré-definidos
      allowNull: false,
      defaultValue: 'public', // Valor padrão: 'public' ou outro valor apropriado
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Communities', 'type');
  },
};
