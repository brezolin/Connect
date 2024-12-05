const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class CommunityMember extends Model {}

CommunityMember.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    communityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Communities',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'CommunityMember',
    tableName: 'CommunityMembers',
    timestamps: true,
  }
);

module.exports = CommunityMember;
