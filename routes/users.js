const express = require('express');
const router = express.Router();


const userController = require('../controller/user/user-controller')
const productController = require('../controller/user/product-controller')
const profileController = require('../controller/user/profile-controller')
const paymentController = require('../controller/user/payment-controller')
const wishlistController = require('../controller/user/wishlist-controller')
const cartController = require('../controller/user/cart-controller')
const orderController = require('../controller/user/order-controller')

// middlewares

const userAuthentication = require('../middleware/user-authentication');
const wishlist = require('../models/wishlist-model');

router.route('/')
  .get(userController.verificationUser)
  .post(userController.verificationUserLogin)

router.route('/login')
  .get(userController.userLogin)

router.route('/signup')
  .get(userController.signupUser)
  .post(userController.signupUserData)

router.route('/logout')
  .get(userAuthentication, userController.logout)

router.route('/product')
  .get(productController.getProduct)

router.route('/viewprofile')
  .get(userAuthentication, profileController.viewprofile)


router.route('/edituserdata')
  .get(userAuthentication, profileController.editUserData)
  .post(userAuthentication, profileController.editPersonalData)

router.route('/viewuseraddress')
  .get(userAuthentication, profileController.viewUserAddress)


router.route('/edituseraddress/:_id')
  .get(userAuthentication, profileController.editUserAddress)
  .post(userAuthentication, profileController.editUserAddressData)

router.route('/adduseraddress')
  .get(userAuthentication, profileController.addUserAddress)
  .post(userAuthentication, profileController.addUserAddressData)
  .delete(userAuthentication, profileController.deleteUserAddress)

router.route('/checkout')
  .get(userAuthentication, paymentController.addressSelect)

router.route('/checkout/:_id')
  .get(userAuthentication, paymentController.checkoutData)

router.route('/selectpayment')
  .get(userAuthentication, paymentController.paymentSelect)

router.route('/selectpayment')
  .post(userAuthentication, paymentController.paymentSelectData)

router.route('/finalpayment')
  .get(userAuthentication, paymentController.finalPayment)
  .post(userAuthentication, paymentController.checkout)

router.route('/verifypayment')
  .post(userAuthentication, paymentController.verifypayment)

router.route('/paymentfailed/:id')
  .delete(userAuthentication, paymentController.cancelOrder)

router.route('/checkCoupen')
  .post(userAuthentication, paymentController.checkCoupen)

router.route('/Wishlist')
  .get(userAuthentication, wishlistController.viewWishlist)
  .post(userAuthentication, wishlistController.addVishlist)
  .delete(userAuthentication, wishlistController.deleteWishlist)

router.route('/cart')
  .get(userAuthentication, cartController.viewCart)
  .post(userAuthentication, cartController.addCart)
  .delete(userAuthentication, cartController.deleteCart)

router.route('/cahngeCartData')
  .post(userAuthentication, cartController.cahngeCartdata)

router.route('/myorders')
  .get(userAuthentication, orderController.viewOrders)

router.route('/vieworders/:_id')
  .get(userAuthentication, orderController.viewSingleOrder)

router.route('/ordercancel/:id')
  .get(userAuthentication, orderController.cancelOrder)

router.route('/changeuserpassword')
  .post(userAuthentication, profileController.changePassword)



module.exports = router;
