const router = require('express').Router();
const ctrl = require('../controllers/taskController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/milestone/:milestoneId', requireAuth, ctrl.listByMilestone);
router.post('/milestone/:milestoneId', requireAuth, requireRole('mentor', 'admin'), ctrl.create);
router.put('/:id', requireAuth, ctrl.update);

module.exports = router;
