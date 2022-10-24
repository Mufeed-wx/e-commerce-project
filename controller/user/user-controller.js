var session = require('express-session');
let productHelper = require('../../helpers/product-helpers');
const userhelper = require('../../helpers/user-helper');

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
                    productHelper.getproduct_data().then((product) => {
                        session.product_data = product;
                        res.render('user/userhome', { session, user: true });
                    });
                } else {
                    req.session.user = false;
                    res.render('error/error500')
                }
            } else {
                productHelper.getproduct_data().then((product) => {
                    session.product_data = product;
                    res.render('user/userhome', { session, user: true });
                });
            }
        }
        catch (err) {
            next(err)
        }

    },
    verificationUserLogin: (req, res, next) => {
        try {
            userhelper.userlogin(req.body).then((response) => {
                if (response.status) {
                    session = req.session
                    req.session.user = response.user;
                    res.json({ msg: 'success' });
                } else {
                    console.log('failed login');
                    res.json({ msg: 'usernotfound' });
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
                console.log(session.userAlreadyExist);
                res.render('user/signup', { session, user: true });
            }
        }
        catch (err) {
            next(err)
        }

    },
    signupUserData: (req, res, next) => {
        try {
            console.log("sdsadas", req.body);
            userhelper.usersignup(req.body).then((state) => {
                if (state.exist) {
                    session = req.session;
                    req.session.NumberAlreadyExist = true;
                    console.log('number already exist');
                    res.render('user/signup', { session, user: true });
                } else {
                    req.session.numberexist = false;
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
            console.log("reached");
            req.session.user = false;
            console.log(req.session.user, 'kkkkkk');
            res.json({ msg: 'success' });
        }
        catch (err) {
            next(err)
        }
    },

}