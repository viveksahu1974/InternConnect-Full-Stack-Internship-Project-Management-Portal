const { Notification } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']], limit: 50 });
    const unreadCount = await Notification.count({ where: { userId: req.user.id, isRead: false } });
    res.json({ success: true, message: 'Notifications fetched', data: { notifications, unreadCount } });
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    await notification.update({ isRead: true });
    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    res.json({ success: true, message: 'All notifications marked as read', data: {} });
  } catch (err) {
    next(err);
  }
};
