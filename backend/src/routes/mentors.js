const router = require('express').Router();
const ctrl = require('../controllers/mentorController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth, requireRole('mentor'));
router.get('/me/profile', ctrl.getProfile);
router.put('/me/profile', ctrl.updateProfile);
router.get('/me/interns', ctrl.interns);
router.get('/me/dashboard', ctrl.dashboard);

module.exports = router;
