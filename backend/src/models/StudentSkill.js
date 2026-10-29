const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentSkill = sequelize.define('StudentSkill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  proficiency: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'student_skills', timestamps: true });

module.exports = StudentSkill;
