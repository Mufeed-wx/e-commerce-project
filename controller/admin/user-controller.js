const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const adminhelper = require("../../helpers/admin-helper");
const productHelper = require("../../helpers/product-helpers");
const multer = require("multer");
const productcontrol = require('../../models/product-modal')
const userHomeHelper = require("../../helpers/user-home-helper")
var fs = require('fs')
const coupenmodel = require('../../models/coupen-model');

const authentication = require('../../middleware/admin-authentication');

module.exports = {
    verification: async (req, res, next) => {
        try {
            if (req.session.admin) {
                session = req.session;
                console.log(session.adminnotfound, 'kakakakak');
                await adminhelper.salesReport((data) => {
                    console.log("dataa", data);
                    res.render("admin/adminhome", { session, admin: true, data });
                })

            } else {
                res.redirect("/admin/adminloginpage");
            }
        }
        catch (err) {
            next(err)
        }
    },
    verificationlogin: (req, res, next) => {
        try {
            if (req.session.admin) {
                console.log('ja');
                res.redirect("/admin");
            } else {
                session = req.session;
                res.render("admin/adminlogin", { session, admin: true });
            }
        }
        catch (err) {
            next(err)
        }
    },
    loginData: (req, res, next) => {
        try {
            adminhelper.adminlogin(req.body).then((response) => {
                if (response.status) {
                    session = req.session;
                    req.session.adminnotfound = false;
                    req.session.admin = response.admin;
                    req.session.adminrview = true;
                    res.redirect("/admin");
                } else {
                    console.log("haaaaaaaaaaaaaaaa");
                    req.session.adminnotfound = true;
                    res.redirect("/admin/adminloginpage");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    logout: (req, res, next) => {
        try {
            req.session.admin = false;
            res.json({ msg: 'success' });
        }
        catch (err) {
            next(err)
        }
    },
    blockUser: (req, res, next) => {
        try {
            let userid = req.params.id;
            console.log(userid);
            adminhelper.block_user(userid).then((userdata) => {
                req.session.user.User_status = false;
                res.redirect("/admin/view_user");
            });
        }
        catch (err) {
            next(err)
        }
    },
    activeUser: (req, res, next) => {
        try {
            let userid = req.params.id;
            console.log(userid);
            console.log("active");
            adminhelper.active_user(userid).then((userdata) => {
                req.session.user.User_status = true;
                res.redirect("/admin/view_user");
            });
        }
        catch (err) {
            next(err)
        }
    },
    viewUser: (req, res, next) => {
        try {
            if (req.session.admin) {
                adminhelper.getuserdata().then((data) => {
                    console.log("vaaaaam");
                    console.log(data);
                    session = req.session;
                    session.userdata = data;
                    res.render("admin/view_user", { session, admin: true });
                });
            } else {
                res.redirect("/admin");
            }
        }
        catch (err) {
            next(err)
        }
    },
    viewHomeEdit: (req, res, next) => {
        try {
            userHomeHelper.getCurousel().then((data) => {
                session = req.session;
                let banner = data;
                console.log("find data", banner);
                res.render("admin/manage_UserHome", { banner, admin: true })
            })
        }
        catch (err) {
            next(err)
        }
    },
    curouselEdit: (req, res, next) => {
        try {
            const images = req.files;
            array = images.map((value) => value.filename);
            req.body.image = array;
            const data = {
                Curousel_title: [req.body.Curousel_title1,
                req.body.Curousel_title2,
                req.body.Curousel_title2],
                image: array,
                _id: req.params._id,
            }
            userHomeHelper.addCurousel(data).then((response) => {
                console.log("Successfully Stored curouse");
                res.redirect("/admin/Manage_userHome")
            }).catch((err) => {
                console.log("error found at curousel controller");
            })
        }
        catch (err) {
            next(err)
        }
    },
    viewCoupenData: (req, res, next) => {
        try {
            productHelper.getCoupons((data) => {
                console.log("data", data);
                res.render("admin/manage-coupen", { session, admin: true, data })
            })
        }
        catch (err) {
            next(err)
        }
    },
    addCoupen: (req, res, next) => {
        try {
            console.log(req.body, 'kkkkkkkkk');
            adminhelper.addCoupon(req.body, async (err, response) => {
                if (err) {
                    console.log("error")
                } else {
                    if (response) {
                        console.log('reached', response);
                        res.render("admin/manage-coupen", { admin: true })
                    }
                    else {
                        console.log('coupen exist')
                        res.render("admin/manage-coupen", { admin: true })
                    }
                }
            })

        }
        catch (err) {
            next(err)
        }
    },
    deleteCoupen: (req, res, next) => {
        try {
            id = req.params._id
            productHelper.deleteCoupon(id, (response) => {
                res.redirect('/admin/coupen')
            })
        }
        catch (err) {
            next(err)
        }
    },
    editCoupen: (req, res, next) => {
        try {
            id = req.params._id
            productHelper.editCoupon(id, (data) => {
                res.render('admin/coupen-edit', { session, admin: true, data })
            })
        }
        catch (err) {
            next(err)
        }
    },
    editCoupenData: (req, res, next) => {
        try {
            id = req.params._id
            data = req.body
            productHelper.updateCoupon(id, data, (response) => {
                res.redirect('/admin/coupen')
            })
        }
        catch (err) {
            next(err)
        }
    },
}