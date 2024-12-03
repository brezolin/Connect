const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Community = sequelize.define(
  'Community',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('open', 'closed'), // Aberta ou Fechada
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    associatedGame: {
      type: DataTypes.STRING, // Nome do jogo associado, se aplicável
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Nome da tabela de usuários
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'Communities',
    timestamps: true, // Inclui os campos createdAt e updatedAt
  }
);

// Definindo as associações no modelo
Community.associate = (models) => {
  Community.belongsTo(models.User, {
    foreignKey: 'creatorId',
    as: 'creator',
  });
};

module.exports = Community;
