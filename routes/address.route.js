const router = require('express').Router();

const authControllers= require('../controllers/auth.controller');

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses
} = require('../controllers/address.controller');


router.use(authControllers.protect, authControllers.allowedTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;

