const { Internship, Project, User, Milestone, Task } = require('../models');

exports.myInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({
      where: { studentId: req.user.id },
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] },
        { model: Milestone, include: [Task] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (!internship) return res.json({ success: true, message: 'No active internship', data: null });
    res.json({ success: true, message: 'Internship fetched', data: internship });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const internship = await Internship.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] },
        { model: Milestone, include: [Task] },
      ],
    });
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

    const isOwner = internship.studentId === req.user.id || internship.mentorId === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this internship' });
    }
    res.json({ success: true, message: 'Internship fetched', data: internship });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'mentor') where.mentorId = req.user.id;
    const internships = await Internship.findAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'title'] },
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json({ success: true, message: 'Internships fetched', data: internships });
  } catch (err) {
    next(err);
  }
};
