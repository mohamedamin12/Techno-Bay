const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
// const User = require('../models/user.model');
const Product = require('../models/products.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');


/**
 *  @desc    create cash order
 *  @route   /api/order/:cartId
 *  @method  POST 
 *  @access  private (logged in user)
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });


  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: 'success', data: order });
});

/**
 *  @desc    Update order paid status to paid
 *  @route   /api/order/:id/pay
 *  @method  PUT 
 *  @access  private (only admin and manager)
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

/**
 *  @desc    Update order delivered status
 *  @route   /api/order/:id/deliver
 *  @method  PUT 
 *  @access  private (only admin and manager)
 */
exports.updateOrderToDelivered  = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});

/**
 *  @desc    Get checkout session from stripe and send it as response
 *  @route   /api/order/checkout-session/:cartId
 *  @method  PUT 
 *  @access  private (logged in user)
 */
exports.checkoutSession = asyncHandler(async (req , res , next)=>{
   // app settings
   const taxPrice = 0;
   const shippingPrice = 0;
 
   // Get cart depend on cartId
   const cart = await Cart.findById(req.params.cartId);
   if (!cart) {
     return next(
       new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
     );
   }
 
   // Get order price depend on cart price "Check if coupon apply"
   const cartPrice = cart.totalPriceAfterDiscount
     ? cart.totalPriceAfterDiscount
     : cart.totalCartPrice;
 
   const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

     // Create stripe checkout session
     const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: `Order from ${req.user.username}`,
            },
            unit_amount: totalOrderPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/order`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: {
        shipping_address: JSON.stringify(req.body.shippingAddress)
      },
    });
  
    // send session to response
    res.status(200).json({ status: 'success', session });
})