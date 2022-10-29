const session = require('express-session')
const { resolve, reject } = require('promise')
const promise = require('promise')
const cartModel = require('../models/cart-model')
var fs = require('fs')
const productModel = require('../models/product-model')

module.exports = {
  addToCart: async (data, cb) => {
    let taskData = true
    let userCart = await cartModel.findOne({ user_id: data.userId })
    if (userCart) {
      let cartProduct = await cartModel.findOne({
        user_id: data.userId,
        'Cartdata.productId': data.productId,
      })
      if (cartProduct) {
        const product = await productModel
          .find({ _id: data.productId })
          .lean()
        await cartModel.updateOne(
          { user_id: data.userId, 'Cartdata.productId': data.productId },
          { $inc: { 'Cartdata.$.quantity': 1 } }
        )
        cb(null, taskData)
      } else {
        const product = await productModel
          .find({ _id: data.productId })
          .lean()
        let cartArray = {
          productId: data.productId,
          quantity: product[0].order_limit,
        }
        await cartModel.findOneAndUpdate(
          { user_id: data.userId },
          {
            $push: { Cartdata: cartArray },
          }
        )
        cb(null, taskData)
      }
    } else {
      const product = await productModel.find({ _id: data.productId }).lean()
      console.log(data.productId);
      let body = {
        user_id: data.userId,
        Cartdata: [
          { productId: data.productId, quantity: product[0].order_limit },
        ],
      }
      await cartModel.create(body)
      cb(null, taskData)
    }
  },
  getCart: (id, cb) => {
    let taskData = true
    cartModel
      .findOne({ user_id: id })
      .populate('Cartdata.productId')
      .lean()
      .then((data) => {
        console.log('check one')
        cb(null, data)
      })
      .catch((err) => {
        console.log('errror occuresd')
        cb(err, null)
      })
  },
  changeCartQty: async (data, cb) => {
    await cartModel
      .updateOne(
        { user_id: data.userId, 'Cartdata.productId': data.productId },
        { 'Cartdata.$.quantity': data.value }
      )
      .then((data) => {
        let taskData = true
        cb(null, data)
      })
      .catch((err) => {
        cb(err, null)
      })
  },
  cartDataCalculation: async (id, cb) => {
    cartModel
      .findOne({ user_id: id })
      .populate('Cartdata.productId')
      .lean()
      .then((data) => {
        let cartlength = data.Cartdata.length
        let value = {
          total: null,
          subTotal: [],
        }

        if (cartlength >= 0) {
          value.total = data.Cartdata.reduce((acc, curr) => {
            acc += curr.productId.Product_Prize * curr.quantity
            return acc
          }, 0)

          value.subTotal = data.Cartdata.map(myFunction)
          function myFunction(data, index, array) {
            return data.productId.Product_Prize * data.quantity
          }
          cb(null, value)
        } else {
          cb(null, total)
        }
      })
      .catch((err) => {
        console.log('errror occured in get total', err)
        cb(err, null)
      })
  },
  deleteItems: (productid, id, cb) => {
    cartModel.updateOne(
      { user_id: id },
      { $pull: { Cartdata: { productId: productid } } },
      (err, taskData) => {
        if (err) {
          cb(err, null)
        } else {
          cb(null, taskData)
        }
      }
    )
  },
}
