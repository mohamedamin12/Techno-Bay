const categoryRoute = require('./categories.route');
const brandRoute = require('./brands.route');
const productRoute = require('./products.route');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const reviewRoute = require('./review.route');
const wishlistRoute = require('./wishlist.route');
const addressRoute = require('./address.route');
const couponRoute = require('./coupon.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');

const mountRoutes = (app) => {
  app.use('/api/categories', categoryRoute);
  app.use('/api/brands', brandRoute);
  app.use('/api/products', productRoute);
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
  app.use('/api/reviews', reviewRoute);
  app.use('/api/wishlist', wishlistRoute);
  app.use('/api/addresses', addressRoute);
  app.use('/api/coupons', couponRoute);
  app.use('/api/cart', cartRoute);
  app.use('/api/order', orderRoute);
};

module.exports = mountRoutes;