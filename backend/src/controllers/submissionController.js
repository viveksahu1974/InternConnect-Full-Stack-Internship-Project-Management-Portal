const { Submission, Task, Milestone, Internship, Feedback, User } = require('../models');
const { recalcProgress, notify } = require('./_helpers');

exports.create = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId, { include: [{ model: Milestone, include: [Internship] }] });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const { content, githubUrl, liveUrl, fileUrl } = req.body;
    if (!content && !githubUrl && !liveUrl && !fileUrl) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'content', message: 'Provide a text response, repo link, live URL, or file' }] });
    }

    const submission = await Submission.create({
      taskId, studentId: req.user.id, content, githubUrl, liveUrl, fileUrl, status: 'submitted', submittedAt: new Date(),
    });
    await task.update({ status: 'submitted' });
    await recalcProgress(task.milestoneId);

    const internship = task.Milestone && task.Milestone.Internship;
    if (internship && internship.mentorId) {
      await notify(internship.mentorId, 'New submission to review', `A student submitted work for "${task.title}".`, 'submission');
    }

    res.status(201).json({ success: true, message: 'Submission recorded successfully', data: submission });
  } catch (err) {
    next(err);
  }
};

exports.listForMentor = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const submissions = await Submission.findAll({
      where,
      include: [
        { model: Task, include: [{ model: Milestone, include: [Internship] }] },
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
      ],
      order: [['submittedAt', 'DESC']],
    });
    const filtered = req.user.role === 'mentor'
      ? submissions.filter((s) => s.Task && s.Task.Milestone && s.Task.Milestone.Internship && s.Task.Milestone.Internship.mentorId === req.user.id)
      : submissions;
    res.json({ success: true, message: 'Submissions fetched', data: filtered });
  } catch (err) {
    next(err);
  }
};

exports.review = async (req, res, next) => {
  try {
    const submission = await Submission.findByPk(req.params.id, { include: [{ model: Task, include: [Milestone] }] });
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    const { decision, comment, score } = req.body;
    const validDecisions = ['approved', 'rejected', 'revision_required'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'decision', message: 'Decision must be approved, rejected, or revision_required' }] });
    }

    await submission.update({ status: decision });
    if (comment || score !== undefined) {
      await Feedback.create({ submissionId: submission.id, mentorId: req.user.id, comment, score });
    }

    const task = submission.Task;
    if (decision === 'approved') {
      await task.update({ status: 'completed' });
    } else if (decision === 'revision_required') {
      await task.update({ status: 'in_progress' });
    }
    await recalcProgress(task.milestoneId);

    await notify(
      submission.studentId,
      decision === 'approved' ? 'Submission approved' : decision === 'rejected' ? 'Submission rejected' : 'Revision requested',
      `Your mentor reviewed "${task.title}".${comment ? ` Feedback: ${comment}` : ''}`,
      'review'
    );

    res.json({ success: true, message: 'Submission reviewed successfully', data: submission });
  } catch (err) {
    next(err);
  }
};
