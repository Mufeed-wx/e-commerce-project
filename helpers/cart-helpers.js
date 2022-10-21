const session = require("express-session")
const { resolve, reject } = require("promise")
const promise = require("promise")
const cartmodel = require('../models/cart-model')
var fs = require('fs')
const productcontrol = require('../models/product-modal')

module.exports = {
  addToCart: async (data, cb) => {
    let taskData = true;
    let usercart = await cartmodel.findOne({ user_id: data.userid })
    if (usercart) {
      console.log("check 1");
      let cartproduct = await cartmodel.findOne({
        user_id: data.userid,
        "Cartdata.productId": data.productid,
      });
      if (cartproduct) {
        console.log("check 2");
        const product = await productcontrol.find({ _id: data.productid }).lean()
        await cartmodel
          .updateOne(
            { user_id: data.userid, "Cartdata.productId": data.productid },
            { $inc: { "Cartdata.$.quantity": 1 } })
        cb(null, taskData);
      } else {
        console.log("check 3");
        const product = await productcontrol.find({ _id: data.productid }).lean()
        let cartArray = { productId: data.productid, quantity: product[0].order_limit };
        await cartmodel
          .findOneAndUpdate(
            { user_id: data.userid },
            {
              $push: { Cartdata: cartArray },
            }
          )
        cb(null, taskData);
      }
    } else {
      console.log("user not found");
      const product = await productcontrol.find({ _id: data.productid }).lean()
      console.log(product[0].order_limit, "dsfhj");
      let body = {
        user_id: data.userid,
        Cartdata: [{ productId: data.productid, quantity: product[0].order_limit }],
      };
      await cartmodel.create(body);
      cb(null, taskData);
    }
  },
  getCart: (id, cb) => {
    let taskData = true
    cartmodel.findOne({ user_id: id }).populate('Cartdata.productId').lean().then((data) => {
      console.log("check one");
      cb(null, data);
    }).catch((err) => {
      console.log("errror occuresd");
      cb(err, null);
    })

  },
  changeCartQty: async (data, cb) => {
    await cartmodel
      .updateOne(
        { user_id: data.userid, "Cartdata.productId": data.productid },
        { "Cartdata.$.quantity": data.value }).then((data) => {
          console.log("reached");
          let taskData = true;
          cb(null, data);
        }).catch((err) => {
          console.log("errror occured in cartQty Change");
          cb(err, null);
        })

  },
  getCartDataToatalPrize: (async (id, cb) => {

    cartmodel.findOne({ user_id: id }).populate('Cartdata.productId').lean().then((data) => {
      let cartlength = data.Cartdata.length
      let value = {
        total: null,
        subTotal: [],
      }

      if (cartlength >= 0) {
        value.total = data.Cartdata.reduce((acc, curr) => {
          acc += curr.productId.Product_Prize * curr.quantity;
          return acc;
        }, 0);

        value.subTotal = data.Cartdata.map(myFunction);
        function myFunction(data, index, array) {
          return data.productId.Product_Prize * data.quantity;
        }
        cb(null, value);
      } else {
        cb(null, total);
      }

    }).catch((err) => {
      console.log("errror occured in get total", err);
      cb(err, null);
    })

  }),
  deleteItems: (productid, id, cb) => {
    cartmodel.updateOne({ user_id: id }, { $pull: { Cartdata: { productId: productid } } }, (err, taskData) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, taskData);
      }
    });
  }

}