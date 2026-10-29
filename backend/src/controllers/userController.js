const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, StudentProfile, MentorProfile } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.json({
      success: true,
      message: 'Users fetched',
      data: rows,
      pagination: { page: Number(page), limit: Number(limit), total: count, totalPages: Math.ceil(count / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'name/email/password/role', message: 'All fields are required' }] });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: [{ field: 'email', message: 'Email already in use' }] });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });
    if (role === 'student') await StudentProfile.create({ userId: user.id });
    if (role === 'mentor') await MentorProfile.create({ userId: user.id });
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, phone, role, status, avatar } = req.body;
    await user.update({
      name: name ?? user.name,
      phone: phone ?? user.phone,
      role: role ?? user.role,
      status: status ?? user.status,
      avatar: avatar ?? user.avatar,
    });
    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully', data: {} });
  } catch (err) {
    next(err);
  }
};
