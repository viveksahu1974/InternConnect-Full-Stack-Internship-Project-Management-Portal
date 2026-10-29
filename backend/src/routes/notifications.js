const router = require('express').Router();
const ctrl = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, ctrl.list);
router.put('/:id/read', requireAuth, ctrl.markRead);
router.put('/read-all', requireAuth, ctrl.markAllRead);

module.exports = router;
