const router = require('express').Router();
const ctrl = require('../controllers/milestoneController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/internship/:internshipId', requireAuth, ctrl.listByInternship);
router.post('/internship/:internshipId', requireAuth, requireRole('mentor', 'admin'), ctrl.create);
router.put('/:id', requireAuth, requireRole('mentor', 'admin'), ctrl.update);

module.exports = router;
