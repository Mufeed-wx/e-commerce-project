const express = require("express");
const router = express.Router();
const adminhelper = require("../../helpers/admin-helper");
const productHelper = require("../../helpers/product-helpers");
const multer = require("multer");
const productcontrol = require('../../models/product-modal')

var fs = require('fs')


module.exports = {
    getProductData: (req, res, next) => {
        try {
            adminhelper.getcategory().then((category) => {
                adminhelper.getsubcategory().then((subcategory) => {
                    productHelper.getproduct().then((product) => {
                        session = req.session;
                        session.categorydata = category;
                        session.subcategorydata = subcategory;
                        session.product = product;
                        res.render("admin/Manage_Product", { session, admin: true });
                    });
                });
            });
        }
        catch (err) {
            next(err)
        }
    },
    getCategoryData: (req, res, next) => {
        try {
            if (req.session.admin) {
                adminhelper.getcategory().then((category) => {
                    adminhelper.getsubcategory().then((subcategory) => {
                        session.categorydata = category;
                        session.subcategorydata = subcategory;
                        res.render("admin/Manage_Category", { session, admin: true });
                    });
                });
            } else {
                res.redirect("/admin");
            }
        }
        catch (err) {
            next(err)
        }
    },
    addCategory: (req, res, next) => {
        try {
            session = req.session;
            adminhelper.addCategory(req.body).then((response) => {
                if (response.categoryexist) {
                    req.session.categoryexist = true;

                    res.redirect("/admin/Manage_Category");
                } else {
                    console.log("category stored");
                    req.session.categoryexist = false;
                    res.redirect("/admin/Manage_Category");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    deleteCategory: (req, res, next) => {
        try {
            let userid = req.params._id;
            adminhelper.deletecategory(userid).then((data) => {
                if (data) {
                    console.log("deleted");
                    res.redirect("/admin/Manage_Category");
                } else {
                    console.log(data);
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    editCategory: (req, res, next) => {
        try {
            session = req.session;
            req.body._id = req.params._id;
            adminhelper.editCategory(req.body).then((response) => {
                if (response.categoryexist) {
                    req.session.categoryexist = true;
                    res.redirect("/admin/Manage_Category");
                } else {
                    console.log("category edited");
                    req.session.categoryexist = false;
                    res.redirect("/admin/Manage_Category");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    addSubCategory: (req, res, next) => {
        try {
            adminhelper.addsubCategory(req.body).then((response) => {
                if (response.subcategoryexist) {
                    req.session.subcategoryexist = true;
                    res.redirect("/admin/Manage_Category");
                } else {
                    console.log("subcategory stored");
                    req.session.subcategoryexist = false;
                    res.redirect("/admin/Manage_Category");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    deleteSubCategory: (req, res, next) => {
        try {
            let userid = req.params._id;
            adminhelper.deletesubcategory(userid).then((data) => {
                if (data) {
                    console.log("delete subcategory");
                    res.redirect("/admin/Manage_Category");
                } else {
                    console.log(data);
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    addProduct: (req, res, next) => {
        try {
            const images = req.files;
            array = images.map((value) => value.filename);
            req.body.image = array;
            productHelper
                .addproduct(req.body)
                .then((response) => {
                    console.log("successfully stored product");
                })
                .catch((err) => {
                    console.log("error found", err);
                });
        }
        catch (err) {
            next(err)
        }
    },
    editProduct: (req, res, next) => {
        try {
            productHelper.getproductByid(req.params).then((productDataByEdit) => {
                adminhelper.getcategory().then((category) => {
                    session = req.session;
                    session.productDataByEdit = productDataByEdit;
                    session.categorydata = category;
                    res.render("admin/product_edit", { session, admin: true });
                });
            });
        }
        catch (err) {
            next(err)
        }
    },
    editProductData: (req, res, next) => {
        try {
            const images = req.files;
            array = images.map((value) => value.filename);
            req.body.image = array;
            let ID = req.params._id;
            req.body._id = ID;
            productHelper.EditproductByid(req.body).then((Editdata) => {
                res.redirect('/admin/Manage_Product')
            });
        }
        catch (err) {
            next(err)
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            console.log("vannu");
            let image = await productcontrol.findById({ _id: req.params._id }).lean()

            let final = image.image;
            final.forEach(data => {
                fs.unlinkSync('public/' + data);
            })
            let data = await productcontrol.findByIdAndDelete({ _id: req.params._id })
            console.log("deleted");
            res.redirect('/admin/Manage_Product')


        }
        catch (err) {
            next(err)
        }
    },
}