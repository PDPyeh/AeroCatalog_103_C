const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Aircraft = sequelize.define('Aircraft', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manufacturerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'manufacturers',
      key: 'id',
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  modelName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  yearIntroduced: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxPassengers: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cruiseSpeed: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  maxAltitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  wingspan: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  length: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  maxTakeoffWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  engines: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  engineType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  range: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'aircraft',
});

module.exports = Aircraft;


