const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Community extends Model {
  static associate(models) {
    // Associação com o modelo User (criador da comunidade)
    Community.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });

    // Associação com o modelo User (membros da comunidade)
    Community.belongsToMany(models.User, {
      through: 'UserCommunity',
      as: 'members',
      foreignKey: 'communityId',
    });

    // Associação com o modelo Post
    Community.hasMany(models.Post, {
      foreignKey: 'communityId',
      as: 'posts',
    });
  }
}

Community.init(
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
    sequelize,
    modelName: 'Community',
    tableName: 'Communities',
    timestamps: true, // Inclui os campos createdAt e updatedAt
  }
);

module.exports = Community;
