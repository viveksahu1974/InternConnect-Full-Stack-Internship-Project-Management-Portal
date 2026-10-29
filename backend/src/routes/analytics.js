const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/admin', requireAuth, requireRole('admin'), ctrl.admin);
router.get('/mentor', requireAuth, requireRole('mentor'), ctrl.mentor);
router.get('/student', requireAuth, requireRole('student'), ctrl.student);

module.exports = router;
