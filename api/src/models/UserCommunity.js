const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class UserCommunity extends Model {}

UserCommunity.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    communityId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Communities',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'UserCommunity',
    tableName: 'UserCommunities',
    timestamps: true,
  }
);

module.exports = UserCommunity;
