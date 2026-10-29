const { Milestone, Internship, Task } = require('../models');

exports.listByInternship = async (req, res, next) => {
  try {
    const milestones = await Milestone.findAll({
      where: { internshipId: req.params.internshipId },
      include: [Task],
      order: [['createdAt', 'ASC']],
    });
    res.json({ success: true, message: 'Milestones fetched', data: milestones });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { internshipId } = req.params;
    const internship = await Internship.findByPk(internshipId);
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });
    if (req.user.role === 'mentor' && internship.mentorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { title, description, startDate, deadline } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'title', message: 'Title is required' }] });
    const milestone = await Milestone.create({ internshipId, title, description, startDate, deadline, status: 'not_started', progress: 0 });
    res.status(201).json({ success: true, message: 'Milestone created successfully', data: milestone });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
    await milestone.update(req.body);
    res.json({ success: true, message: 'Milestone updated successfully', data: milestone });
  } catch (err) {
    next(err);
  }
};
