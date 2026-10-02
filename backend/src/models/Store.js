const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  address: { type: DataTypes.STRING(400), allowNull: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'stores',
  timestamps: false,
});

module.exports = Store;
