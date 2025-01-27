const router = require('express').Router();
const {
  createCashOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession
} = require('../controllers/order.controller');

const { allowedTo, protect } = require('../middlewares/auth.middleware');


router.use(authControllers.protect);
 
router.get(
  '/checkout-session/:cartId',
  checkoutSession
);

router.route('/:cartId').post(createCashOrder);

router.use(protect , allowedTo('admin' , 'manager'))

router.put(
  '/:id/pay',
  updateOrderToPaid
);
router.put(
  '/:id/deliver',
  updateOrderToDelivered
);

module.exports = router;