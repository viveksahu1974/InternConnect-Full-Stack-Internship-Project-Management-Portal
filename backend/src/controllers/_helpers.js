const { Notification, Task, Milestone, Internship } = require('../models');

async function notify(userId, title, message, type = 'general') {
  return Notification.create({ userId, title, message, type });
}

// Recalculate a milestone's progress from its tasks, then the parent internship's
// overall progress from all of its milestones. Called any time a task/submission
// status changes so numbers are never hand-set.
async function recalcProgress(milestoneId) {
  const milestone = await Milestone.findByPk(milestoneId);
  if (!milestone) return;

  const tasks = await Task.findAll({ where: { milestoneId } });
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const milestoneProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

  let milestoneStatus = milestone.status;
  if (total > 0 && completed === total) milestoneStatus = 'completed';
  else if (completed > 0) milestoneStatus = 'in_progress';

  await milestone.update({ progress: milestoneProgress, status: milestoneStatus });

  const internship = await Internship.findByPk(milestone.internshipId);
  if (!internship) return;

  const allMilestones = await Milestone.findAll({ where: { internshipId: internship.id } });
  const overall =
    allMilestones.length > 0
      ? Math.round(allMilestones.reduce((sum, m) => sum + m.progress, 0) / allMilestones.length)
      : 0;

  const updates = { overallProgress: overall };
  if (overall === 100 && allMilestones.every((m) => m.status === 'completed')) {
    updates.status = 'completed';
  }
  await internship.update(updates);
}

module.exports = { notify, recalcProgress };
