const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'submitted', 'completed'),
    defaultValue: 'pending',
  },
  dueDate: DataTypes.DATE,
}, { tableName: 'tasks', timestamps: true });

module.exports = Task;
