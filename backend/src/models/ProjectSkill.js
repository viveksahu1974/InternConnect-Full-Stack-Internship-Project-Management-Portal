const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectSkill = sequelize.define('ProjectSkill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'project_skills', timestamps: false });

module.exports = ProjectSkill;
