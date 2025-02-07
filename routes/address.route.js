const router = require('express').Router();

const authMiddleware= require('../middlewares/auth.middleware');

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses
} = require('../controllers/address.controller');


router.use(authMiddleware.protect, authMiddleware.protect('user') );

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;

