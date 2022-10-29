const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const adminHelper = require("../../helpers/admin-helper");
const productHelper = require("../../helpers/product-helpers");
const userHomeHelper = require("../../helpers/user-home-helper")
var fs = require('fs')

module.exports = {
    //ADMIN VERIFICATION
    verification: async (req, res, next) => {
        try {
            if (req.session.admin) {
                session = req.session;
                await adminHelper.salesReport((data) => {
                    res.render("admin/dashboard", { session, admin: true, data });
                })

            } else {
                res.redirect("/admin/login");
            }
        }
        catch (err) {
            next(err)
        }
    },
    //VIEW ADMIN LOGIN PAGE
    viewLoginPage: (req, res, next) => {
        try {
            if (req.session.admin) {
                res.redirect("/admin");
            } else {
                session = req.session;
                res.render("admin/login-page", { session, admin: true });
            }
        }
        catch (err) {
            next(err)
        }
    },
    //VERIFICATION OF LOGIN DATA
    verifyLoginData: (req, res, next) => {
        try {
            adminHelper.verifyLogin(req.body).then((response) => {
                if (response.status) {
                    session = req.session;
                    req.session.adminNotFound = false;
                    req.session.admin = response.admin;
                    res.redirect("/admin");
                } else {
                    req.session.adminNotFound = true;
                    res.redirect("/admin/login");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    //ADMIN LOGOUT
    logout: (req, res, next) => {
        try {
            req.session.admin = false;
            res.json({ msg: 'success' });
        }
        catch (err) {
            next(err)
        }
    },
    //BLOCK USER STATUS
    blockUser: (req, res, next) => {
        try {
            let userId = req.body.id;
            adminHelper.block_user(userId).then((response) => {

                res.json({ status: 200 })
            });
        }
        catch (err) {
            next(err)
        }
    },
    //ACTIVE USER STATUS
    activeUser: (req, res, next) => {
        try {
            let userId = req.body.id;
            adminHelper.active_user(userId).then((data) => {
                res.json({ status: 200 })
            });
        }
        catch (err) {
            next(err)
        }
    },
    //VIEW USER MANAGEMENT PAGE
    viewUser: (req, res, next) => {
        try {
            if (req.session.admin) {
                adminHelper.getUserData().then((data) => {
                    session = req.session;
                    session.userData = data;
                    res.render("admin/user-management", { session, admin: true });
                });
            } else {
                res.redirect("/admin");
            }
        }
        catch (err) {
            next(err)
        }
    },
    //VIEW USER GENERAL MANAGEMENT PAGE
    viewHomeEdit: (req, res, next) => {
        try {
            userHomeHelper.getCarousel().then((data) => {
                session = req.session;
                let banner = data;
                res.render("admin/user-home-management", { banner, admin: true })
            })
        }
        catch (err) {
            next(err)
        }
    },
    //CAROUSEL EDIT DATA
    carouselEdit: (req, res, next) => {
        try {
            const images = req.files;
            array = images.map((value) => value.filename);
            req.body.image = array;
            const data = {
                Curousel_title: [req.body.Curousel_title1,
                req.body.Curousel_title2,
                req.body.Curousel_title2],
                image: array,
                _id: req.query.id,
            }
            userHomeHelper.addCarousel(data).then((response) => {
                res.redirect("/admin/user-home-management")
            }).catch((err) => {
                console.log("error found at carousel");
            })
        }
        catch (err) {
            next(err)
        }
    },
    //VIEW COUPON MANAGEMENT PAGE
    viewCouponData: (req, res, next) => {
        try {
            productHelper.getCoupons((data) => {
                res.render("admin/coupon-management", { session, admin: true, data })
            })
        }
        catch (err) {
            next(err)
        }
    },
    //ADD COUPON DATA
    addCoupon: (req, res, next) => {
        try {
            adminHelper.addCoupon(req.body, async (err, response) => {
                if (err) {
                    console.log("error")
                } else {
                    if (response) {
                        res.render("admin/coupon-management", { admin: true })
                    }
                    else {
                        res.render("admin/coupon-management", { admin: true })
                    }
                }
            })
        }
        catch (err) {
            next(err)
        }
    },
    //DELETE SINGLE COUPON
    deleteCoupon: (req, res, next) => {
        try {
            id = req.body.id
            productHelper.deleteCoupon(id, (response) => {
                res.json({ status: 200 })
            })
        }
        catch (err) {
            next(err)
        }
    },
    //PAGE VIEW OF EDIT COUPON DATA
    editCoupon: (req, res, next) => {
        try {
            id = req.params._id
            productHelper.editCoupon(id, (data) => {
                res.render('admin/edit-coupon', { session, admin: true, data })
            })
        }
        catch (err) {
            next(err)
        }
    },
    //EDIT COUPON DATA
    editCouponData: (req, res, next) => {
        try {
            id = req.params._id
            data = req.body
            productHelper.updateCoupon(id, data, (response) => {
                res.redirect('/admin/coupon-management')
            })
        }
        catch (err) {
            next(err)
        }
    },
}