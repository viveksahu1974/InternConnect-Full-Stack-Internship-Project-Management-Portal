const router = require('express').Router();
const ctrl = require('../controllers/studentController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth, requireRole('student'));
router.get('/me/profile', ctrl.getProfile);
router.put('/me/profile', ctrl.updateProfile);
router.post('/me/skills', ctrl.addSkill);
router.delete('/me/skills/:id', ctrl.removeSkill);
router.get('/me/dashboard', ctrl.dashboard);

module.exports = router;
