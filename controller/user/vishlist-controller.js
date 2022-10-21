var session = require('express-session');
const wishlistHelpers = require('../../helpers/wishlist-helpers')

module.exports = {
  viewWishlist: async (req, res, next) => {
    try {
      session = req.session
      console.log(req.session.user._id, "gaaaaaaaaaaaaaaaa");
      wishlistHelpers
        .getwishlistItems(req.session.user._id)
        .then((response) => {
          console.log(response);
          if (response.wishlistempty) {
            res.render('user/wishlist', { session, user: true });
          }
          else {
            wishlist = response.list;
            console.log("jhbdsfas", wishlist);
            res.render('user/wishlist', { session, wishlist, user: true });
          }

        })
    }
    catch (err) {
      next(err)
    }

  },
  addVishlist: (req, res, next) => {
    try {
      session = req.session
      console.log(req.session.user._id, req.body.id, "idddddddss");
      wishlistHelpers
        .addwishlist(req.session.user._id, req.body.id)
        .then((response) => {
          console.log(response, "wishlisttttttttt");
          wishlistempty = response.wishlistempty;
          wishlist = response.wishlist;

          res.json([{
            id_recieved: req.body.id,
          }])
        });
    }
    catch (err) {
      next(err)
    }
  },
  deleteWishlist: (req, res, next) => {
    try {
      console.log("dfs", req.body.id);
      console.log("dsf", req.session.user._id);
      wishlistHelpers.deleteItems(req.body.id, req.session.user._id, (err, taskData) => {
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