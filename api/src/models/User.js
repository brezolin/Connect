const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  platforms: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  favorite_games: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  friends: {
    type: DataTypes.JSON, // Armazena uma lista de IDs de amigos
    allowNull: true,
  },
});

User.associate = (models) => {
  // Comunidades criadas pelo usuário
  User.hasMany(models.Community, {
    foreignKey: 'creatorId',
    as: 'createdCommunities', // Alias único para as comunidades criadas
  });

  // Comunidades que o usuário participa
  User.belongsToMany(models.Community, {
    through: 'CommunityMember', // Tabela intermediária
    as: 'joinedCommunities', // Alias para comunidades que o usuário participa
    foreignKey: 'userId',
  });
};



module.exports = User;
