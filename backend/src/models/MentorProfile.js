const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MentorProfile = sequelize.define('MentorProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  specialization: DataTypes.STRING,
  experience: DataTypes.STRING,
  bio: DataTypes.TEXT,
  department: DataTypes.STRING,
}, { tableName: 'mentor_profiles', timestamps: true });

module.exports = MentorProfile;
