const User = require('./User');
const Manufacturer = require('./Manufacturer');
const Category = require('./Category');
const Aircraft = require('./Product');
const ApiKey = require('./ApiKey');

// Define associations
Manufacturer.hasMany(Aircraft, {
  foreignKey: 'manufacturerId',
  as: 'aircraft',
});

Aircraft.belongsTo(Manufacturer, {
  foreignKey: 'manufacturerId',
  as: 'manufacturer',
});

Category.hasMany(Aircraft, {
  foreignKey: 'categoryId',
  as: 'aircraft',
});

Aircraft.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

User.hasMany(ApiKey, {
  foreignKey: 'userId',
  as: 'apiKeys',
});

ApiKey.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = {
  User,
  Manufacturer,
  Category,
  Aircraft,
  ApiKey,
};
