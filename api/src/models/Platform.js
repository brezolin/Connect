const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Platform = sequelize.define('Platform', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'platforms',
  timestamps: false, // Não precisamos de createdAt e updatedAt para plataformas
});

module.exports = Platform;
