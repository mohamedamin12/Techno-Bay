const router = require('express').Router();
const {
  signupValidator,
  loginValidator,
} = require('../utils/validation/authValidator');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyPassResetCode
} = require('../controllers/auth.controller');


router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router;