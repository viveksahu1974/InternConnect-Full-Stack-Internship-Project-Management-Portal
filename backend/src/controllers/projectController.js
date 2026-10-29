const { Op } = require('sequelize');
const { Project, Skill, ProjectSkill, User, Application } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const {
      search, category, difficulty, technology, mentor, status,
      sort = 'newest', page = 1, limit = 9,
    } = req.query;

    const where = {};
    if (category && category !== 'all') where.category = { [Op.iLike ? Op.iLike : Op.like]: category };
    if (difficulty) where.difficulty = difficulty;
    if (mentor) where.mentorId = mentor;
    if (status) where.status = status;
    else where.status = { [Op.ne]: 'archived' };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'deadline') order = [['applicationDeadline', 'ASC']];
    if (sort === 'difficulty') order = [['difficulty', 'ASC']];
    if (sort === 'duration') order = [['duration', 'ASC']];

    const include = [
      { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] },
      { model: ProjectSkill, include: [Skill] },
    ];

    let projectIds;
    if (technology) {
      const skill = await Skill.findOne({ where: { name: { [Op.like]: `%${technology}%` } } });
      if (skill) {
        const links = await ProjectSkill.findAll({ where: { skillId: skill.id } });
        projectIds = links.map((l) => l.projectId);
        if (projectIds.length === 0) {
          return res.json({ success: true, message: 'Projects fetched', data: [], pagination: { page: Number(page), limit: Number(limit), total: 0, totalPages: 1 } });
        }
        where.id = projectIds;
      }
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Project.findAndCountAll({
      where, include, order, limit: Number(limit), offset, distinct: true,
    });

    let data = rows;
    if (sort === 'popular') {
      const withCounts = await Promise.all(rows.map(async (p) => ({ p, c: await Application.count({ where: { projectId: p.id } }) })));
      data = withCounts.sort((a, b) => b.c - a.c).map((x) => x.p);
    }

    res.json({
      success: true,
      message: 'Projects fetched',
      data,
      pagination: { page: Number(page), limit: Number(limit), total: count, totalPages: Math.ceil(count / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] },
        { model: ProjectSkill, include: [Skill] },
      ],
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const applicationsCount = await Application.count({ where: { projectId: project.id } });
    res.json({ success: true, message: 'Project fetched', data: { ...project.toJSON(), applicationsCount } });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title, description, objectives, requirements, category, difficulty,
      duration, seats, applicationDeadline, startDate, endDate, skills,
    } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'title/description', message: 'Title and description are required' }] });
    }
    const mentorId = req.user.role === 'mentor' ? req.user.id : req.body.mentorId;
    const project = await Project.create({
      title, description, objectives, requirements, category, difficulty,
      duration, seats: seats || 1, applicationDeadline, startDate, endDate, mentorId,
    });

    if (Array.isArray(skills)) {
      for (const skillName of skills) {
        let skill = await Skill.findOne({ where: { name: skillName } });
        if (!skill) skill = await Skill.create({ name: skillName, category: category || 'General' });
        await ProjectSkill.create({ projectId: project.id, skillId: skill.id });
      }
    }

    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (req.user.role === 'mentor' && project.mentorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own projects' });
    }
    await project.update(req.body);
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (req.user.role === 'mentor' && project.mentorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own projects' });
    }
    await project.destroy();
    res.json({ success: true, message: 'Project deleted successfully', data: {} });
  } catch (err) {
    next(err);
  }
};
