const router = require('express').Router();
const {
  createCashOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession
} = require('../controllers/order.controller');

const authControllers = require('../controllers/auth.controller');


router.use(authControllers.protect);
 
router.get(
  '/checkout-session/:cartId',
  checkoutSession
);

router.route('/:cartId').post(createCashOrder);

router.use(authControllers.protect , authControllers.allowedTo('admin' , 'manager'))

router.put(
  '/:id/pay',
  updateOrderToPaid
);
router.put(
  '/:id/deliver',
  updateOrderToDelivered
);

module.exports = router;