const router = require('express').Router();
const storeCtrl = require('../controllers/storeController');
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');
const validate = require('../middleware/validate');
const { ratingSchema } = require('../validators/schemas');

router.use(verifyToken, allowRoles('user'));

router.get('/', storeCtrl.listStores);
router.post('/:id/rating', validate(ratingSchema), storeCtrl.submitRating);
router.put('/:id/rating', validate(ratingSchema), storeCtrl.updateRating);

module.exports = router;
