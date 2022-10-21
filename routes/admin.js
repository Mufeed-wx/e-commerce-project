const express = require("express");
const router = express.Router();
const multer = require("multer");
const productcontrol = require('../models/product-modal')
var fs = require('fs')

const orderController = require('../controller/admin/order-controller')
const userController = require('../controller/admin/user-controller')
const productController = require('../controller/admin/product-controller')

//Middleware
const midddleware = require('../middleware/admin-authentication');

const { storage } = midddleware;
const upload = multer({ storage });

const { StorageCurousel } = midddleware;
const Curouselupload = multer({
  storage: StorageCurousel,
});
// const { route } = require("./users");

router.route('/')
  .get(userController.verification)

router.route('/adminloginpage')
  .get(userController.verificationlogin)
  .post(userController.loginData)

router.route('/adminlogout')
  .get(userController.logout)



router.route('/block-user/:id')
  .get(midddleware.authentication, userController.blockUser)

router.route('/active-user/:id')
  .get(midddleware.authentication, userController.activeUser)

router.route('/view_user')
  .get(midddleware.authentication, userController.viewUser)




router.route('/Manage_Category')
  .get(midddleware.authentication, productController.getCategoryData)

router.route('/Add_Category')
  .post(midddleware.authentication, productController.addCategory)

router.route('/delete-category/:_id')
  .get(midddleware.authentication, productController.deleteCategory)

router.route('/edit_Category/:_id')
  .post(midddleware.authentication, productController.editCategory)



router.route('/Add_SubCategory')
  .post(midddleware.authentication, productController.addSubCategory)

router.route('/delete-sub-category/:_id')
  .get(midddleware.authentication, productController.deleteSubCategory)


router.route('/Manage_Product')
  .get(midddleware.authentication, productController.getProductData)

router.route('/Add_Product',)
  .post(midddleware.authentication, upload.array("image", 3), productController.addProduct)

router.route('/editproduct/:_id')
  .get(midddleware.authentication, productController.editProduct)

router.route('/editproduct/:_id')
  .post(midddleware.authentication, upload.array("image", 3), productController.editProductData)

router.get('/deleteproduct/:_id')
  .get(midddleware.authentication, productController.deleteProduct)



router.route('/Manage_userHome')
  .get(midddleware.authentication, userController.viewHomeEdit)

router.route('/editCorousel/:_id')
  .post(midddleware.authentication, Curouselupload.array("image", 3), userController.curouselEdit)



router.route('/coupen')
  .get(midddleware.authentication, userController.viewCoupenData)
  .post(midddleware.authentication, userController.addCoupen)

router.route('/deletecoupen/:_id')
  .get(midddleware.authentication, userController.deleteCoupen)

router.route('/editcoupen/:_id')
  .get(midddleware.authentication, userController.editCoupen)

router.route('/editcoupen/:_id')
  .post(midddleware.authentication, userController.editCoupenData)



router.route('/orders')
  .get(midddleware.authentication, orderController.getOrders)
  .post(midddleware.authentication, orderController.changePaymentStatus)

router.route('/ordercancel')
  .post(midddleware.authentication, orderController.cancelOrder)

router.route('/vieworder/:_id')
  .get(midddleware.authentication, orderController.vieworder)



router.route('/salesreport')
  .get(midddleware.authentication, orderController.salesReport)



router.get("/deleteproduct/:_id", async (req, res) => {
  let image = await productcontrol.findById({ _id: req.params._id }).lean()

  let final = image.image;
  final.forEach(data => {
    fs.unlinkSync('public/' + data);
  })

  try {

    let data = await productcontrol.findByIdAndDelete({ _id: req.params._id })
    console.log("deleted");
    res.redirect('/admin/Manage_Product')
  }
  catch {
    console.log("error occured in product deletion");
  }
});

module.exports = router;
