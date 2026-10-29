const router = require('express').Router();
const ctrl = require('../controllers/submissionController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/task/:taskId', requireAuth, requireRole('student'), ctrl.create);
router.get('/', requireAuth, requireRole('mentor', 'admin'), ctrl.listForMentor);
router.put('/:id/review', requireAuth, requireRole('mentor', 'admin'), ctrl.review);

module.exports = router;
