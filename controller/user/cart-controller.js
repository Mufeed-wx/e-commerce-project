var session = require('express-session');
const cartHelpers = require('../../helpers/cart-helpers')

module.exports = {
  viewCart: (req, res, next) => {
    try {
      session = req.session;
      let id = req.session.user._id;
      cartHelpers.getCart(id, (err, data) => {
        if (err) {
          console.log(err, "jf");

        } else {
          if (data) {
            cartHelpers.getCartDataToatalPrize(req.session.user._id, (err, total) => {
              console.log("hahaah", total);
              session = req.session;
              session.cart = data;
              session.cartTotal = total
              console.log(session.cartTotal, "ghsdfh");
              res.render('user/cart', { session, user: true })
            })

          } else {
            res.render('user/cart', { session, user: true })
            console.log("data not found")
          }

        }
      });
    }
    catch (err) {
      next(err)
    }
  },
  addCart: (req, res, next) => {
    try {
      console.log("jkbhdf", req.body);
      var data = {
        productid: req.body.id,
        userid: req.session.user._id,
      };
      console.log(data, "fa");
      cartHelpers.addToCart(data, (err, taskData) => {
        if (err) {
          res.json({ msg: 'error' });
        } else {
          res.json({ msg: 'success' });
        }
      });
    }
    catch (err) {
      next(err)
    }
  },
  cahngeCartdata: (req, res, next) => {
    try {
      var data = {
        productid: req.body.id,
        userid: req.session.user._id,
        value: req.body.value,
      };
      cartHelpers.changeCartQty(data, (err, taskData) => {
        if (err) {
          res.json({ msg: 'error' });
        } else {
          res.json({ msg: 'success', data: taskData });
        }
      });
    }
    catch (err) {
      next(err)
    }
  },
  deleteCart: (req, res, next) => {
    try {
      console.log(req.body, "ggg");
      console.log("dfs", req.body.id);
      console.log("dsf", req.session.user._id);
      cartHelpers.deleteItems(req.body.id, req.session.user._id, (err, taskData) => {
        if (err) {
          res.json({ msg: 'error' });
        } else {
          res.json({ msg: 'success' });
        }
      });
    }
    catch (err) {
      next(err)
    }
  }

}