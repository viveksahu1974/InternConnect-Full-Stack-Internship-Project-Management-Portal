const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Milestone = sequelize.define('Milestone', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  startDate: DataTypes.DATE,
  deadline: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'submitted', 'under_review', 'approved', 'revision_required', 'completed'),
    defaultValue: 'not_started',
  },
  progress: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { tableName: 'milestones', timestamps: true });

module.exports = Milestone;
