const { StudentProfile, StudentSkill, Skill, Application, Project, Internship, Milestone, User } = require('../models');

function calcProfileCompletion(profile, hasSkills) {
  let pct = 0;
  if (profile.college && profile.degree && profile.branch) pct += 20;
  if (profile.semester) pct += 20;
  if (hasSkills) pct += 20;
  if (profile.resumeUrl) pct += 20;
  if (profile.github || profile.linkedin) pct += 20;
  return pct;
}

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    const skills = await StudentSkill.findAll({ where: { studentId: req.user.id }, include: [Skill] });
    const completion = profile ? calcProfileCompletion(profile, skills.length > 0) : 0;
    res.json({ success: true, message: 'Profile fetched', data: { profile, skills, profileCompletion: completion } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    const fields = ['college', 'degree', 'branch', 'semester', 'bio', 'github', 'linkedin', 'resumeUrl'];
    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (!profile) {
      profile = await StudentProfile.create({ userId: req.user.id, ...updates });
    } else {
      await profile.update(updates);
    }
    if (req.body.name || req.body.phone) {
      await req.user.update({ name: req.body.name ?? req.user.name, phone: req.body.phone ?? req.user.phone });
    }
    res.json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (err) {
    next(err);
  }
};

exports.addSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'name', message: 'Skill name is required' }] });
    let skill = await Skill.findOne({ where: { name } });
    if (!skill) skill = await Skill.create({ name, category: category || 'General' });
    const existing = await StudentSkill.findOne({ where: { studentId: req.user.id, skillId: skill.id } });
    if (existing) return res.status(400).json({ success: false, message: 'Skill already added' });
    const studentSkill = await StudentSkill.create({ studentId: req.user.id, skillId: skill.id, proficiency: proficiency || 'beginner' });
    res.status(201).json({ success: true, message: 'Skill added successfully', data: studentSkill });
  } catch (err) {
    next(err);
  }
};

exports.removeSkill = async (req, res, next) => {
  try {
    const row = await StudentSkill.findOne({ where: { id: req.params.id, studentId: req.user.id } });
    if (!row) return res.status(404).json({ success: false, message: 'Skill not found' });
    await row.destroy();
    res.json({ success: true, message: 'Skill removed successfully', data: {} });
  } catch (err) {
    next(err);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
    const skills = await StudentSkill.findAll({ where: { studentId: req.user.id } });
    const applications = await Application.findAll({ where: { studentId: req.user.id } });
    const internship = await Internship.findOne({
      where: { studentId: req.user.id, status: 'active' },
      include: [{ model: Project, as: 'project' }, { model: User, as: 'mentor', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    let pendingTasks = 0;
    let completedTasks = 0;
    let underReviewTasks = 0;
    if (internship) {
      const milestones = await Milestone.findAll({ where: { internshipId: internship.id }, include: ['Tasks'] });
      milestones.forEach((m) => {
        (m.Tasks || []).forEach((t) => {
          if (t.status === 'completed') completedTasks += 1;
          else if (t.status === 'submitted') underReviewTasks += 1;
          else pendingTasks += 1;
        });
      });
    }

    const completion = profile ? calcProfileCompletion(profile, skills.length > 0) : 0;

    res.json({
      success: true,
      message: 'Dashboard data fetched',
      data: {
        profileCompletion: completion,
        verifiedSkillsCount: skills.filter((s) => s.verified).length,
        totalSkillsCount: skills.length,
        applicationsCount: applications.length,
        activeInternship: internship,
        overallProgress: internship ? internship.overallProgress : 0,
        tasks: { completed: completedTasks, pending: pendingTasks, underReview: underReviewTasks },
      },
    });
  } catch (err) {
    next(err);
  }
};
