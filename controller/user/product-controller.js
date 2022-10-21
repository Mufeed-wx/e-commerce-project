var session = require('express-session');
let productHelper = require('../../helpers/product-helpers');
const userhelper = require('../../helpers/user-helper');

module.exports = {
    getProduct: (req, res, next) => {
        try {
            productHelper.getproduct_data().then((product) => {
                session = req.session;
                session.product_data = product;
                console.log('get product');
                res.render('user/product', { session, user: true });
            });
        }
        catch (err) {
            next(err)
        }
    }
}