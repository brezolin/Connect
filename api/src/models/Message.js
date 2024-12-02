const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Message extends Model {}

Message.init(
  {
    senderId: { // Altere para camelCase
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: { // Altere para camelCase
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages', // Certifique-se de que o nome da tabela está correto
    timestamps: true, // Inclua os timestamps se `createdAt` e `updatedAt` forem usados
  }
);

module.exports = Message;
