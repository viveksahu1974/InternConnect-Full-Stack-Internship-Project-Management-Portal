const sequelize = require('../config/db');

const User = require('./User');
const StudentProfile = require('./StudentProfile');
const MentorProfile = require('./MentorProfile');
const Skill = require('./Skill');
const StudentSkill = require('./StudentSkill');
const Project = require('./Project');
const ProjectSkill = require('./ProjectSkill');
const Application = require('./Application');
const Internship = require('./Internship');
const Milestone = require('./Milestone');
const Task = require('./Task');
const Submission = require('./Submission');
const Feedback = require('./Feedback');
const Notification = require('./Notification');
const SavedProject = require('./SavedProject');

// User <-> StudentProfile / MentorProfile (1:1)
User.hasOne(StudentProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(MentorProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
MentorProfile.belongsTo(User, { foreignKey: 'userId' });

// Student skills (many-to-many via StudentSkill)
User.hasMany(StudentSkill, { foreignKey: 'studentId', onDelete: 'CASCADE' });
StudentSkill.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Skill.hasMany(StudentSkill, { foreignKey: 'skillId', onDelete: 'CASCADE' });
StudentSkill.belongsTo(Skill, { foreignKey: 'skillId' });

// Project skills
Project.hasMany(ProjectSkill, { foreignKey: 'projectId', onDelete: 'CASCADE' });
ProjectSkill.belongsTo(Project, { foreignKey: 'projectId' });
Skill.hasMany(ProjectSkill, { foreignKey: 'skillId', onDelete: 'CASCADE' });
ProjectSkill.belongsTo(Skill, { foreignKey: 'skillId' });

// Project <-> Mentor (creator/owner)
User.hasMany(Project, { foreignKey: 'mentorId', as: 'mentoredProjects' });
Project.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

// Applications
User.hasMany(Application, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Project.hasMany(Application, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Application.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Saved projects
User.hasMany(SavedProject, { foreignKey: 'studentId', onDelete: 'CASCADE' });
SavedProject.belongsTo(User, { foreignKey: 'studentId' });
Project.hasMany(SavedProject, { foreignKey: 'projectId', onDelete: 'CASCADE' });
SavedProject.belongsTo(Project, { foreignKey: 'projectId' });

// Internships
User.hasMany(Internship, { foreignKey: 'studentId', as: 'studentInternships' });
Internship.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
User.hasMany(Internship, { foreignKey: 'mentorId', as: 'mentorInternships' });
Internship.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });
Project.hasMany(Internship, { foreignKey: 'projectId' });
Internship.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Application.hasOne(Internship, { foreignKey: 'applicationId' });
Internship.belongsTo(Application, { foreignKey: 'applicationId' });

// Milestones -> Tasks
Internship.hasMany(Milestone, { foreignKey: 'internshipId', onDelete: 'CASCADE' });
Milestone.belongsTo(Internship, { foreignKey: 'internshipId' });
Milestone.hasMany(Task, { foreignKey: 'milestoneId', onDelete: 'CASCADE' });
Task.belongsTo(Milestone, { foreignKey: 'milestoneId' });

// Submissions
Task.hasMany(Submission, { foreignKey: 'taskId', onDelete: 'CASCADE' });
Submission.belongsTo(Task, { foreignKey: 'taskId' });
User.hasMany(Submission, { foreignKey: 'studentId' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Feedback
Submission.hasMany(Feedback, { foreignKey: 'submissionId', onDelete: 'CASCADE' });
Feedback.belongsTo(Submission, { foreignKey: 'submissionId' });
User.hasMany(Feedback, { foreignKey: 'mentorId' });
Feedback.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

// Notifications
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  StudentProfile,
  MentorProfile,
  Skill,
  StudentSkill,
  Project,
  ProjectSkill,
  Application,
  Internship,
  Milestone,
  Task,
  Submission,
  Feedback,
  Notification,
  SavedProject,
};
