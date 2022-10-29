const express = require('express');
const router = express.Router();

//CONTROLLERS
const userController = require('../controller/user/user-controller')
const productController = require('../controller/user/product-controller')
const profileController = require('../controller/user/profile-controller')
const paymentController = require('../controller/user/payment-controller')
const wishlistController = require('../controller/user/wishlist-controller')
const cartController = require('../controller/user/cart-controller')
const orderController = require('../controller/user/order-controller')

//MIDDLEWARE
const userAuthentication = require('../middleware/user-authentication');
const wishlist = require('../models/wishlist-model');

//MAIN ROUTE
router.route('/')
  .get(userController.verificationUser)
  .post(userController.verificationUserLogin)
  .delete(userAuthentication, userController.logout)

//USER-LOGIN-PAGE
router.route('/login')
  .get(userController.userLogin)

//USER-SIGN-UP
router.route('/signup')
  .get(userController.signupUser)
  .post(userController.signupUserData)

//VIEW PRODUCT
router.route('/product')
  .get(productController.getProduct)

//VIEW-USER-PROFILE
router.route('/profile')
  .get(userAuthentication, profileController.viewProfile)

//EDIT-USER-PROFILE-DATA
router.route('/edit-user-data')
  .get(userAuthentication, profileController.editUserData)
  .post(userAuthentication, profileController.editPersonalData)

//VIEW-USER-ADDRESS
router.route('/view-address')
  .get(userAuthentication, profileController.viewUserAddress)

//EDIT-USER-ADDRESS
router.route('/edit-user-address/:_id')
  .get(userAuthentication, profileController.editUserAddress)
  .post(userAuthentication, profileController.editAddress)

//ADD-AND-DELETE-USER-ADDRESS
router.route('/add-address')
  .get(userAuthentication, profileController.addUserAddress)
  .post(userAuthentication, profileController.addUserAddressData)
  .delete(userAuthentication, profileController.deleteUserAddress)

//CHECKOUT-VIEW-ADDRESS-SELECT-PAGE 
router.route('/checkout')
  .get(userAuthentication, paymentController.addressSelect)

//CHECKOUT-VIEW-PAYMENT-METHOD-SELECT-PAGE 
router.route('/checkout/:_id')
  .get(userAuthentication, paymentController.paymentSelect)

//CHECKOUT-GET-PAYMENT-METHOD
router.route('/payment-method')
  .post(userAuthentication, paymentController.paymentSelectData)

//VIEW-AND-GET-FINAL-PAYMENT
router.route('/place-order')
  .get(userAuthentication, paymentController.finalPayment)
  .post(userAuthentication, paymentController.placeOrder)

//VERIFY-PAYMENT
router.route('/verify-payment')
  .post(userAuthentication, paymentController.verifyPayment)

//PAYMENT-FAILED
router.route('/payment-failed/:id')
  .delete(userAuthentication, paymentController.cancelOrder)

//CHECK-COUPON
router.route('/check-coupon')
  .post(userAuthentication, paymentController.checkCoupon)

//  WISHLIST-VIEW-AND-DELETE
router.route('/Wishlist')
  .get(userAuthentication, wishlistController.viewWishlist)
  .post(userAuthentication, wishlistController.addWishlist)
  .delete(userAuthentication, wishlistController.deleteWishlist)

//CART-VIEW-AND-DELETE-CHANGE QTY
router.route('/cart')
  .get(userAuthentication, cartController.viewCart)
  .post(userAuthentication, cartController.addCart)
  .delete(userAuthentication, cartController.deleteCart)
  .put(userAuthentication, cartController.cartQty)

//VIEW-ORDERS
router.route('/orders')
  .get(userAuthentication, orderController.viewOrders)

//VIEW-SINGLE-ORDERS
router.route('/view-orders/:_id')
  .get(userAuthentication, orderController.viewSingleOrder)

//CANCEL-ORDER
router.route('/cancel-order/:id')
  .get(userAuthentication, orderController.cancelOrder)

//CHANGE-USED-PASSWORD
router.route('/change-password')
  .post(userAuthentication, profileController.changePassword)

//VIEW-SINGLE-PRODUCT
router.route('/single-product/:_id')
  .get(userAuthentication, userController.singleProduct)

//CONTACT-PAGE
router.route('/contact')
  .get(userController.contactView)

module.exports = router;
