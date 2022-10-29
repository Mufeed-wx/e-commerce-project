var session = require('express-session')
const cartHelpers = require('../../helpers/cart-helpers')

module.exports = {
  //VIEW USER CART PAGE
  viewCart: (req, res, next) => {
    try {
      session = req.session
      let id = req.session.user._id
      cartHelpers.getCart(id, (err, data) => {
        if (err) {
          throw new Error(err)
        } else {
          if (data) {
            cartHelpers.cartDataCalculation(
              req.session.user._id,
              (err, total) => {
                session = req.session
                session.cart = data
                session.cartTotal = total
                res.render('user/cart', { session, user: true })
              }
            )
          } else {
            res.render('user/cart', { session, user: true })
          }
        }
      })
    } catch (err) {
      next(err)
    }
  },
  //ADD USER CART DATA
  addCart: (req, res, next) => {
    try {
      var data = {
        productId: req.body.id,
        userId: req.session.user._id,
      }
      cartHelpers.addToCart(data, (err, taskData) => {
        if (err) {
          res.json({ msg: 'error' })
        } else {
          res.json({ msg: 'success' })
        }
      })
    } catch (err) {
      next(err)
    }
  },
  //CHANGE CART QUANTITY
  cartQty: (req, res, next) => {
    try {
      var data = {
        productId: req.body.id,
        userId: req.session.user._id,
        value: req.body.value,
      }
      cartHelpers.changeCartQty(data, (err, taskData) => {
        if (err) {
          res.json({ msg: 'error' })
        } else {
          res.json({ msg: 'success', data: taskData })
        }
      })
    } catch (err) {
      next(err)
    }
  },
  //DELETE CART QUANTITY
  deleteCart: (req, res, next) => {
    try {
      cartHelpers.deleteItems(
        req.body.id,
        req.session.user._id,
        (err, taskData) => {
          if (err) {
            res.json({ msg: 'error' })
          } else {
            res.json({ msg: 'success' })
          }
        }
      )
    } catch (err) {
      next(err)
    }
  },
}
