const router = require('express').Router();
const ctrl = require('../controllers/applicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/mine', requireAuth, requireRole('student'), ctrl.myApplications);
router.put('/:id/withdraw', requireAuth, requireRole('student'), ctrl.withdraw);
router.get('/', requireAuth, requireRole('mentor', 'admin'), ctrl.list);
router.put('/:id/status', requireAuth, requireRole('mentor', 'admin'), ctrl.updateStatus);

module.exports = router;
