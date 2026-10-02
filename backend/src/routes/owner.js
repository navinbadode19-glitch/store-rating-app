const router = require('express').Router();
const ownerCtrl = require('../controllers/ownerController');
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');

router.use(verifyToken, allowRoles('owner'));

router.get('/store', ownerCtrl.getOwnerDashboard);

module.exports = router;
