const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class CommunityMember extends Model {}

CommunityMember.init(
  {
    communityId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },
  { sequelize, modelName: 'CommunityMember' }
);

module.exports = CommunityMember;
