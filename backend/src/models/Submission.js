const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: DataTypes.TEXT,
  githubUrl: DataTypes.STRING,
  liveUrl: DataTypes.STRING,
  fileUrl: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('submitted', 'approved', 'rejected', 'revision_required'),
    defaultValue: 'submitted',
  },
  submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'submissions', timestamps: true });

module.exports = Submission;
