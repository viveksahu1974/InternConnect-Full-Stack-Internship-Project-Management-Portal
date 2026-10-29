const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentProfile = sequelize.define('StudentProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  college: DataTypes.STRING,
  degree: DataTypes.STRING,
  branch: DataTypes.STRING,
  semester: DataTypes.STRING,
  bio: DataTypes.TEXT,
  github: DataTypes.STRING,
  linkedin: DataTypes.STRING,
  resumeUrl: DataTypes.STRING,
}, { tableName: 'student_profiles', timestamps: true });

module.exports = StudentProfile;
