

const models = {
    User: require('./User'),
    Community: require('./Community'),
    Post: require('./Post'),
    CommunityMember: require('./CommunityMember'),
  };
  
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  
  module.exports = models;
  