const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Post extends Model {}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true, // O título é opcional
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false, // O conteúdo é obrigatório
      validate: {
        notEmpty: true, // Garante que não seja uma string vazia
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false, // O autor é obrigatório
      references: {
        model: 'Users', // Nome da tabela de usuários
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: false, // A comunidade é obrigatória
      references: {
        model: 'Communities', // Nome da tabela de comunidades
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Post',
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  }
);

// Associações (opcional, dependendo da sua aplicação)
Post.associate = (models) => {
  Post.belongsTo(models.User, {
    foreignKey: 'authorId',
    as: 'author',
  });

  Post.belongsTo(models.Community, {
    foreignKey: 'communityId',
    as: 'community',
  });
};

module.exports = Post;
