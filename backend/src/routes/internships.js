const router = require('express').Router();
const ctrl = require('../controllers/internshipController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/mine', requireAuth, requireRole('student'), ctrl.myInternship);
router.get('/', requireAuth, requireRole('mentor', 'admin'), ctrl.list);
router.get('/:id', requireAuth, ctrl.getById);

module.exports = router;
