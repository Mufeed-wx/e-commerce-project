var session = require('express-session');
let productHelper = require('../../helpers/product-helpers');
const userHelper = require('../../helpers/user-helper');
const productModal = require('../../models/product-model')

module.exports = {
    userLogin: (req, res, next) => {
        try {
            if (req.session.user) {

            }
            else {
                res.render('user/user-login', { user: true })
            }
        } catch (error) {
            next(error)
        }
    },
    verificationUser: (req, res, next) => {
        try {
            session = req.session;
            if (req.session.user) {
                if (req.session.user.User_status) {
                    productHelper.getProductData().then((product) => {
                        session.product_data = product;
                        res.render('user/home', { session, user: true });
                    });
                } else {
                    req.session.user = false;
                    res.render('error/error500')
                }
            } else {
                productHelper.getProductData().then((product) => {
                    session.product_data = product;
                    res.render('user/home', { session, user: true });
                });
            }
        }
        catch (err) {
            next(err)
        }

    },
    verificationUserLogin: (req, res, next) => {
        try {
            userHelper.login(req.body).then((response) => {
                if (response.status) {
                    session = req.session
                    req.session.user = response.user;
                    res.json({ msg: 'success' });
                } else {
                    console.log('failed login');
                    res.json({ msg: 'userNotFound' });
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    signupUser: (req, res, next) => {
        try {
            if (req.session.user) {
                res.redirect('/');
            } else {
                session = req.session;
                res.render('user/signup', { session, user: true });
            }
        }
        catch (err) {
            next(err)
        }

    },
    signupUserData: (req, res, next) => {
        try {
            userHelper.signup(req.body).then((state) => {
                if (state.exist) {
                    session = req.session;
                    req.session.NumberAlreadyExist = true;
                    res.render('user/signup', { session, user: true });
                } else {
                    req.session.NumberAlreadyExist = false;
                    req.session.user = state.user;
                    res.redirect('/');
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    logout: (req, res) => {
        try {
            req.session.user = false;
            res.json({ msg: 'success' });
        }
        catch (err) {
            next(err)
        }
    },
    singleProduct: async (req, res, next) => {
        try {
            id = req.params._id;
            var data = await productModal.findById({ _id: id }).populate('Category_Name').populate('Sub_Category_Name').lean()
            res.render('user/single-product', { user: true, session, data })
        }
        catch (err) {
            next(err)
        }
    },
    contactView: async (req, res, next) => {
        try {
            res.render('user/contact', { user: true, session })
        }
        catch (err) {
            next(err)
        }
    },

}