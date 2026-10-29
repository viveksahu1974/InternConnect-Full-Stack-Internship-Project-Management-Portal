const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const applicationCtrl = require('../controllers/applicationController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', requireAuth, requireRole('mentor', 'admin'), ctrl.create);
router.put('/:id', requireAuth, requireRole('mentor', 'admin'), ctrl.update);
router.delete('/:id', requireAuth, requireRole('mentor', 'admin'), ctrl.remove);
router.post('/:projectId/apply', requireAuth, requireRole('student'), applicationCtrl.apply);

module.exports = router;
