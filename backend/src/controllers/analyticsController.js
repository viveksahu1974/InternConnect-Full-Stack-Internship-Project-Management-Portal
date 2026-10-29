const { Op, fn, col } = require('sequelize');
const { User, Project, Application, Internship } = require('../models');

exports.admin = async (req, res, next) => {
  try {
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalMentors = await User.count({ where: { role: 'mentor' } });
    const totalProjects = await Project.count();
    const activeInternships = await Internship.count({ where: { status: 'active' } });
    const pendingApplications = await Application.count({ where: { status: 'pending' } });
    const approvedApplications = await Application.count({ where: { status: 'accepted' } });
    const completedInternships = await Internship.count({ where: { status: 'completed' } });

    const allInternships = await Internship.findAll();
    const avgCompletion = allInternships.length
      ? Math.round(allInternships.reduce((s, i) => s + i.overallProgress, 0) / allInternships.length)
      : 0;

    const byStatusRaw = await Application.findAll({ attributes: ['status', [fn('COUNT', col('id')), 'count']], group: ['status'] });
    const applicationsByStatus = byStatusRaw.map((r) => ({ status: r.status, count: Number(r.get('count')) }));

    const projectsRaw = await Project.findAll({ attributes: ['id', 'title'] });
    const projectPopularity = await Promise.all(
      projectsRaw.map(async (p) => ({ title: p.title, applications: await Application.count({ where: { projectId: p.id } }) }))
    );
    projectPopularity.sort((a, b) => b.applications - a.applications);

    res.json({
      success: true,
      message: 'Admin analytics fetched',
      data: {
        totalStudents,
        totalMentors,
        totalProjects,
        activeInternships,
        pendingApplications,
        approvedApplications,
        completedInternships,
        averageCompletionRate: avgCompletion,
        applicationsByStatus,
        projectPopularity: projectPopularity.slice(0, 8),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.mentor = async (req, res, next) => {
  try {
    const internships = await Internship.findAll({ where: { mentorId: req.user.id } });
    const completionRate = internships.length
      ? Math.round((internships.filter((i) => i.status === 'completed').length / internships.length) * 100)
      : 0;
    const avgProgress = internships.length
      ? Math.round(internships.reduce((s, i) => s + i.overallProgress, 0) / internships.length)
      : 0;
    res.json({
      success: true,
      message: 'Mentor analytics fetched',
      data: { totalInterns: internships.length, completionRate, averageProgress: avgProgress },
    });
  } catch (err) {
    next(err);
  }
};

exports.student = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({ where: { studentId: req.user.id }, order: [['createdAt', 'DESC']] });
    const applicationsCount = await Application.count({ where: { studentId: req.user.id } });
    res.json({
      success: true,
      message: 'Student analytics fetched',
      data: { overallProgress: internship ? internship.overallProgress : 0, applicationsCount },
    });
  } catch (err) {
    next(err);
  }
};
