const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  college: DataTypes.STRING,
  degree: DataTypes.STRING,
  branch: DataTypes.STRING,
  semester: DataTypes.STRING,
  skillsText: DataTypes.STRING,
  resumeUrl: DataTypes.STRING,
  github: DataTypes.STRING,
  linkedin: DataTypes.STRING,
  motivation: DataTypes.TEXT,
  previousProjects: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('pending', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: 'pending',
  },
  appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  reviewedAt: DataTypes.DATE,
}, { tableName: 'applications', timestamps: true });

module.exports = Application;
