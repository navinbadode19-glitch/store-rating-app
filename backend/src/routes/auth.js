const router = require('express').Router();
const authCtrl = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const allowRoles = require('../middleware/allowRoles');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators/schemas');

router.post('/register', validate(registerSchema), authCtrl.register);
router.post('/login', validate(loginSchema), authCtrl.login);

router.put(
  '/password',
  verifyToken,
  allowRoles('user', 'owner'),
  validate(changePasswordSchema),
  authCtrl.changePassword
);

module.exports = router;
