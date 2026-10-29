const { MentorProfile, Internship, User, Project, Milestone, Submission } = require('../models');

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Profile fetched', data: profile });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await MentorProfile.findOne({ where: { userId: req.user.id } });
    const fields = ['specialization', 'experience', 'bio', 'department'];
    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (!profile) profile = await MentorProfile.create({ userId: req.user.id, ...updates });
    else await profile.update(updates);
    res.json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (err) {
    next(err);
  }
};

exports.interns = async (req, res, next) => {
  try {
    const internships = await Internship.findAll({
      where: { mentorId: req.user.id },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'avatar'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
      order: [['updatedAt', 'DESC']],
    });
    res.json({ success: true, message: 'Interns fetched', data: internships });
  } catch (err) {
    next(err);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const internships = await Internship.findAll({ where: { mentorId: req.user.id } });
    const activeInterns = internships.filter((i) => i.status === 'active').length;
    const completedProjects = internships.filter((i) => i.status === 'completed').length;
    const avgProgress = internships.length
      ? Math.round(internships.reduce((s, i) => s + i.overallProgress, 0) / internships.length)
      : 0;

    const internshipIds = internships.map((i) => i.id);
    const milestones = internshipIds.length ? await Milestone.findAll({ where: { internshipId: internshipIds } }) : [];
    const milestoneIds = milestones.map((m) => m.id);

    let pendingReviews = 0;
    let recentSubmissions = [];
    if (milestoneIds.length) {
      const { Task } = require('../models');
      const tasks = await Task.findAll({ where: { milestoneId: milestoneIds } });
      const taskIds = tasks.map((t) => t.id);
      if (taskIds.length) {
        pendingReviews = await Submission.count({ where: { taskId: taskIds, status: 'submitted' } });
        recentSubmissions = await Submission.findAll({
          where: { taskId: taskIds },
          include: [{ model: User, as: 'student', attributes: ['id', 'name'] }],
          order: [['submittedAt', 'DESC']],
          limit: 5,
        });
      }
    }

    res.json({
      success: true,
      message: 'Mentor dashboard fetched',
      data: {
        totalInterns: internships.length,
        activeInterns,
        completedProjects,
        averageProgress: avgProgress,
        pendingReviews,
        recentSubmissions,
      },
    });
  } catch (err) {
    next(err);
  }
};
