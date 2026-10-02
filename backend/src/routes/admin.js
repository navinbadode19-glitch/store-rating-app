const router = require('express').Router();
const adminCtrl = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');
const validate = require('../middleware/validate');
const { addUserSchema, addStoreSchema } = require('../validators/schemas');

router.use(verifyToken, allowRoles('admin'));

router.get('/dashboard', adminCtrl.dashboard);

router.post('/users', validate(addUserSchema), adminCtrl.addUser);
router.get('/users', adminCtrl.listUsers);
router.get('/users/:id', adminCtrl.getUserDetails);

router.post('/stores', validate(addStoreSchema), adminCtrl.addStore);
router.get('/stores', adminCtrl.listStores);

module.exports = router;
