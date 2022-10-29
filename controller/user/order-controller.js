var session = require('express-session')
const orderModel = require('../../models/order-model')
const productHelper = require('../../helpers/product-helpers')
const adminHelper = require('../../helpers/admin-helper')

module.exports = {
  //VIEW ORDER DETAILS
  viewOrders: async (req, res, next) => {
    try {
      session = req.session
      id = req.session.user._id
      const data = await orderModel
        .find({ userID: id, orderStatus: { $ne: 'Cancelled' } })
        .sort({ createdAt: -1 })
        .populate('userID')
        .populate('products.productId')
        .lean()
      res.render('user/order-details', { session, user: true, data })
    } catch (err) {
      next(err)
    }
  },
  //VIEW SINGLE ORDER
  viewSingleOrder: async (req, res, next) => {
    try {
      id = req.params._id
      await productHelper.getSingleOrder(id, (data) => {
        res.render('user/view-orders', { session, user: true, data })
      })
    } catch (err) {
      next(err)
    }
  },
  //CANCEL ORDER
  cancelOrder: async (req, res, next) => {
    try {
      id = req.params.id
      await productHelper.cancelOrder(id, (response) => {
        res.json({ msg: 'success' })
      })
    } catch (err) {
      next(err)
    }
  },
}
