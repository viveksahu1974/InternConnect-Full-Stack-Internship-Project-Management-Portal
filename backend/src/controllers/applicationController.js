const { Application, Project, User, Internship, Milestone, Task } = require('../models');
const { notify } = require('./_helpers');

exports.apply = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This project is not currently accepting applications' });
    }

    const existing = await Application.findOne({ where: { studentId: req.user.id, projectId } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this project' });
    }

    const {
      fullName, email, phone, college, degree, branch, semester,
      skillsText, resumeUrl, github, linkedin, motivation, previousProjects,
    } = req.body;

    if (!fullName || !email || !motivation) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'fullName/email/motivation', message: 'Full name, email and motivation are required' }] });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'email', message: 'Enter a valid email address' }] });
    }

    const application = await Application.create({
      studentId: req.user.id, projectId, fullName, email, phone, college, degree,
      branch, semester, skillsText, resumeUrl, github, linkedin, motivation, previousProjects,
      status: 'pending',
    });

    if (project.mentorId) {
      await notify(project.mentorId, 'New application received', `${fullName} applied to "${project.title}"`, 'application');
    }

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (err) {
    next(err);
  }
};

exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { studentId: req.user.id },
      include: [{ model: Project, as: 'project', attributes: ['id', 'title', 'category', 'difficulty'] }],
      order: [['appliedAt', 'DESC']],
    });
    res.json({ success: true, message: 'Applications fetched', data: applications });
  } catch (err) {
    next(err);
  }
};

exports.withdraw = async (req, res, next) => {
  try {
    const application = await Application.findOne({ where: { id: req.params.id, studentId: req.user.id } });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    await application.update({ status: 'withdrawn' });
    res.json({ success: true, message: 'Application withdrawn', data: application });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { status, projectId, page = 1, limit = 10 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;

    if (req.user.role === 'mentor') {
      const mentorProjects = await Project.findAll({ where: { mentorId: req.user.id }, attributes: ['id'] });
      where.projectId = mentorProjects.map((p) => p.id);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Application.findAndCountAll({
      where,
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title', 'mentorId'] },
      ],
      order: [['appliedAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      message: 'Applications fetched',
      data: rows,
      pagination: { page: Number(page), limit: Number(limit), total: count, totalPages: Math.ceil(count / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

// The core workflow: accepting an application creates the internship, assigns the
// mentor + project, generates the four roadmap milestones with a starter task each,
// and notifies both sides. Rejections/shortlisting just update status + notify.
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'under_review', 'shortlisted', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'status', message: 'Invalid status value' }] });
    }

    const application = await Application.findByPk(req.params.id, { include: [{ model: Project, as: 'project' }] });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (req.user.role === 'mentor' && application.project.mentorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only review applications for your own projects' });
    }

    await application.update({ status, reviewedAt: new Date() });

    if (status === 'accepted') {
      const existingInternship = await Internship.findOne({ where: { applicationId: application.id } });
      if (!existingInternship) {
        const project = application.project;
        const internship = await Internship.create({
          studentId: application.studentId,
          mentorId: project.mentorId,
          projectId: project.id,
          applicationId: application.id,
          startDate: project.startDate || new Date(),
          endDate: project.endDate,
          status: 'active',
          overallProgress: 0,
        });

        const roadmap = [
          { title: 'Web Foundations', description: 'Semantic HTML, accessibility, forms, links, media and page structure.' },
          { title: 'Interface Design', description: 'CSS layouts, responsive design, typography, spacing and reusable components.' },
          { title: 'Interactivity', description: 'JavaScript events, DOM manipulation, validation, arrays and application logic.' },
          { title: 'Quality & Delivery', description: 'Testing, performance, Git workflow, deployment and documentation.' },
        ];
        for (const stage of roadmap) {
          const milestone = await Milestone.create({
            internshipId: internship.id,
            title: stage.title,
            description: stage.description,
            status: 'not_started',
            progress: 0,
          });
          await Task.create({
            milestoneId: milestone.id,
            title: `Kick off: ${stage.title}`,
            description: `Initial task for the "${stage.title}" milestone.`,
            status: 'pending',
          });
        }

        await notify(application.studentId, 'Application accepted!', `You've been accepted into "${project.title}". Your internship has started.`, 'application');
        if (project.mentorId) {
          await notify(project.mentorId, 'New intern assigned', `A new intern has been assigned to "${project.title}".`, 'assignment');
        }
      }
    } else if (status === 'rejected') {
      await notify(application.studentId, 'Application update', `Your application to "${application.project.title}" was not selected this time.`, 'application');
    } else if (status === 'shortlisted') {
      await notify(application.studentId, 'You have been shortlisted', `You've been shortlisted for "${application.project.title}".`, 'application');
    }

    res.json({ success: true, message: 'Application status updated', data: application });
  } catch (err) {
    next(err);
  }
};
