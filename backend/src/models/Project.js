const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  objectives: DataTypes.TEXT,
  requirements: DataTypes.TEXT,
  category: DataTypes.STRING,
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  duration: DataTypes.STRING,
  seats: { type: DataTypes.INTEGER, defaultValue: 1 },
  applicationDeadline: DataTypes.DATE,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  status: { type: DataTypes.ENUM('draft', 'open', 'closed', 'archived'), defaultValue: 'open' },
}, { tableName: 'projects', timestamps: true });

module.exports = Project;
