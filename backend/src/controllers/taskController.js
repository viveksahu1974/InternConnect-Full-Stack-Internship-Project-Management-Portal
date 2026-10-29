const { Task, Milestone } = require('../models');
const { recalcProgress, notify } = require('./_helpers');

exports.listByMilestone = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ where: { milestoneId: req.params.milestoneId }, order: [['createdAt', 'ASC']] });
    res.json({ success: true, message: 'Tasks fetched', data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await Milestone.findByPk(milestoneId);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'title', message: 'Title is required' }] });
    const task = await Task.create({ milestoneId, title, description, dueDate, status: 'pending' });
    await recalcProgress(milestoneId);
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.update(req.body);
    await recalcProgress(task.milestoneId);
    res.json({ success: true, message: 'Task updated successfully', data: task });
  } catch (err) {
    next(err);
  }
};
