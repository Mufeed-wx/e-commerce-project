const express = require("express");
const router = express.Router();
const adminhelper = require("../../helpers/admin-helper");
const productHelper = require("../../helpers/product-helpers");
const multer = require("multer");
const productcontrol = require('../../models/product-modal')
const productModel = require('../../models/product-modal')

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
                        res.render("admin/product-management", { session, admin: true });
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
                        res.render("admin/category-management", { session, admin: true });
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
                if (response.categoryExist) {
                    req.session.categoryExist = true;

                    res.redirect("/admin/category-management");
                } else {
                    console.log("category stored");
                    req.session.categoryExist = false;
                    res.redirect("/admin/category-management");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    deleteCategory: (req, res, next) => {
        try {
            let userid = req.body.id;
            adminhelper.deletecategory(userid).then((data) => {
                if (data) {
                    console.log("deleted");
                    res.json({ status: 200 })
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
            adminhelper.editCategory(req.body).then((response) => {
                if (response.categoryexist) {
                    req.session.categoryexist = true;
                    res.redirect("/admin/category-management");
                } else {
                    console.log("category edited");
                    req.session.categoryexist = false;
                    res.json({ status: 200 })
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    addSubCategory: (req, res, next) => {
        try {
            adminhelper.addSubCategory(req.body).then((response) => {
                if (response.subcategoryexist) {
                    req.session.subcategoryexist = true;
                    res.redirect("/admin/category-management");
                } else {
                    console.log("subcategory stored");
                    req.session.subcategoryexist = false;
                    res.redirect("/admin/category-management");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    deleteSubCategory: (req, res, next) => {
        try {
            let userid = req.body.id;
            console.log('id', userid);
            adminhelper.deletesubcategory(userid).then((data) => {
                if (data) {
                    console.log("delete subcategory");
                    res.json({ status: 200 })
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
                    res.redirect('/admin/product-management')
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
                    res.render("admin/product-edit", { session, admin: true });
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
                res.redirect('/admin/product-management')
            });
        }
        catch (err) {
            next(err)
        }
    },
    deleteProduct: async (req, res, next) => {
        let image = await productModel.findById({ _id: req.body.id }).lean()

        let final = image.image;
        final.forEach(data => {
            fs.unlinkSync('public/' + data);
        })

        try {

            let data = await productModel.findByIdAndDelete({ _id: req.body.id })
            console.log("deleted");
            res.json({ status: 200 })
        }
        catch (err) {
            next(err);
        }
    }
}