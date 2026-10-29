const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  comment: DataTypes.TEXT,
  score: DataTypes.INTEGER,
}, { tableName: 'feedback', timestamps: true });

module.exports = Feedback;
