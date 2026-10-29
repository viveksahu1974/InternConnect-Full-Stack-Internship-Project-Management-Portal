const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SavedProject = sequelize.define('SavedProject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'saved_projects', timestamps: true });

module.exports = SavedProject;
