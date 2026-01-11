const Admin = require('./Admin');
const User = require('./User');
const Manufacturer = require('./Manufacturer');
const Category = require('./Category');
const Aircraft = require('./Product');
const ApiKey = require('./ApiKey');
const ChatSession = require('./ChatSession');
const ChatMessage = require('./ChatMessage');

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

// User (end users) owns API keys and chat sessions
User.hasMany(ApiKey, {
  foreignKey: 'userId',
  as: 'apiKeys',
});

ApiKey.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(ChatSession, {
  foreignKey: 'userId',
  as: 'chatSessions',
});

ChatSession.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

ChatSession.hasMany(ChatMessage, {
  foreignKey: 'sessionId',
  as: 'messages',
});

ChatMessage.belongsTo(ChatSession, {
  foreignKey: 'sessionId',
  as: 'session',
});

module.exports = {
  Admin,
  User,
  Manufacturer,
  Category,
  Aircraft,
  ApiKey,
  ChatSession,
  ChatMessage,
};
