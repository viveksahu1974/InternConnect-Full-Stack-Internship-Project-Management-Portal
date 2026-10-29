const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Internship = sequelize.define('Internship', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  status: { type: DataTypes.ENUM('active', 'completed', 'terminated'), defaultValue: 'active' },
  overallProgress: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { tableName: 'internships', timestamps: true });

module.exports = Internship;
