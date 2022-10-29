const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require('fs')

const orderController = require('../controller/admin/order-controller')
const userController = require('../controller/admin/user-controller')
const productController = require('../controller/admin/product-controller')

//MIDDLEWARE
const middleware = require('../middleware/admin-authentication');

// MULTER USING FOR PRODUCT UPLOAD
const { storage } = middleware;
const upload = multer({ storage });

// MULTER USING FOR CAROUSEL UPLOAD
const { storageCarousel } = middleware;
const carouselUpload = multer({
  storage: storageCarousel,
});


// MAIN ROUTE
router.route('/')
  .get(userController.verification)

// ADMIN LOGIN
router.route('/login')
  .get(userController.viewLoginPage)
  .post(userController.verifyLoginData)
  .delete(userController.logout)


//USER MANAGEMENT-ADMIN SIDE
router.route('/user-management')
  .get(middleware.authentication, userController.viewUser)
  .post(middleware.authentication, userController.blockUser)
  .put(middleware.authentication, userController.activeUser)


//CATEGORY MANAGEMENT-ADMIN SIDE
router.route('/category-management')
  .get(middleware.authentication, productController.getCategoryData)
  .post(middleware.authentication, productController.addCategory)
  .delete(middleware.authentication, productController.deleteCategory)
  .put(middleware.authentication, productController.editCategory)


//SUB CATEGORY MANAGEMENT-ADMIN SIDE
router.route('/sub-category')
  .post(middleware.authentication, productController.addSubCategory)
  .delete(middleware.authentication, productController.deleteSubCategory)

//PRODUCT MANAGEMENT-ADMIN SIDE 
router.route('/product-management')
  .get(middleware.authentication, productController.getProductData)
  .post(middleware.authentication, upload.array("image", 3), productController.addProduct)
  .delete(middleware.authentication, productController.deleteProduct)
router.route('/edit-product/:_id')
  .get(middleware.authentication, productController.editProduct)
  .post(middleware.authentication, upload.array("image", 3), productController.editProductData)

//USER HOME MANAGEMENT-ADMIN SIDE
router.route('/user-home-management')
  .get(middleware.authentication, userController.viewHomeEdit)
  .post(middleware.authentication, carouselUpload.array("image", 3), userController.carouselEdit)

//COUPON MANAGEMENT-ADMIN SIDE
router.route('/coupon-management')
  .get(middleware.authentication, userController.viewCouponData)
  .post(middleware.authentication, userController.addCoupon)
  .delete(middleware.authentication, userController.deleteCoupon)

router.route('/editCoupon/:_id')
  .get(middleware.authentication, userController.editCoupon)
  .post(middleware.authentication, userController.editCouponData)

//ORDER MANAGEMENT-ADMIN SIDE
router.route('/orders-management')
  .get(middleware.authentication, orderController.getOrders)
  .post(middleware.authentication, orderController.changePaymentStatus)

router.route('/orderCancel')
  .post(middleware.authentication, orderController.cancelOrder)

router.route('/viewOrder/:_id')
  .get(middleware.authentication, orderController.viewOrder)

//VIEW SALES REPORT-ADMIN-SIDE
router.route('/sales-report')
  .get(middleware.authentication, orderController.salesReport)


module.exports = router;
