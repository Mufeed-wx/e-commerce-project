const express = require("express");
const router = express.Router();
const adminHelper = require("../../helpers/admin-helper");
const productHelper = require("../../helpers/product-helpers");
const multer = require("multer");
const productModel = require('../../models/product-model')
var fs = require('fs')

module.exports = {
    //VIEW PRODUCT MANAGEMENT PAGE
    getProductData: (req, res, next) => {
        try {
            adminHelper.getCategory().then((category) => {
                adminHelper.getSubCategory().then((subcategory) => {
                    productHelper.getProduct().then((product) => {
                        session = req.session;
                        session.categoryData = category;
                        session.subCategoryData = subcategory;
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
    //VIEW CATEGORY MANAGEMENT
    getCategoryData: (req, res, next) => {
        try {
            if (req.session.admin) {
                adminHelper.getCategory().then((category) => {
                    adminHelper.getSubCategory().then((subcategory) => {
                        session.categoryData = category;
                        session.subCategoryData = subcategory;
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
    //ADD CATEGORY DATA
    addCategory: (req, res, next) => {
        try {
            session = req.session;
            adminHelper.addCategory(req.body).then((response) => {
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
    //DELETE SINGLE CATEGORY
    deleteCategory: (req, res, next) => {
        try {
            let userId = req.body.id;
            adminHelper.deleteCategory(userId).then((data) => {
                if (data) {
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
    //EDIT CATEGORY
    editCategory: (req, res, next) => {
        try {
            session = req.session;
            adminHelper.editCategory(req.body).then((response) => {
                if (response.categoryExist) {
                    req.session.categoryExist = true;
                    res.redirect("/admin/category-management");
                } else {
                    req.session.categoryExist = false;
                    res.json({ status: 200 })
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    //ADD SUBCATEGORY
    addSubCategory: (req, res, next) => {
        try {
            adminHelper.addSubCategory(req.body).then((response) => {
                if (response.subcategoryExist) {
                    req.session.subcategoryExist = true;
                    res.redirect("/admin/category-management");
                } else {
                    console.log("subcategory stored");
                    req.session.subcategoryExist = false;
                    res.redirect("/admin/category-management");
                }
            });
        }
        catch (err) {
            next(err)
        }
    },
    //DELETE SINGLE SUBCATEGORY
    deleteSubCategory: (req, res, next) => {
        try {
            let userId = req.body.id;
            adminHelper.deleteSubcategory(userId).then((data) => {
                if (data) {
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
    //ADD PRODUCT DATA
    addProduct: (req, res, next) => {
        try {
            const images = req.files;
            array = images.map((value) => value.filename);
            req.body.image = array;
            productHelper
                .addProduct(req.body)
                .then((response) => {
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
    //VIEW PRODUCT EDIT PAGE
    editProduct: (req, res, next) => {
        try {
            productHelper.getProductById(req.params).then((productDataByEdit) => {
                adminHelper.getCategory().then((category) => {
                    session = req.session;
                    session.productDataByEdit = productDataByEdit;
                    session.categoryData = category;
                    res.render("admin/product-edit", { session, admin: true });
                });
            });
        }
        catch (err) {
            next(err)
        }
    },
    //EDIT SINGLE PRODUCT DATA
    editProductData: (req, res, next) => {
        try {
            const images = req.files;
            array = images.map((value) => value.filename);
            req.body.image = array;
            let ID = req.params._id;
            req.body._id = ID;
            productHelper.EditProductById(req.body).then((data) => {
                res.redirect('/admin/product-management')
            });
        }
        catch (err) {
            next(err)
        }
    },
    //DELETE SINGLE PRODUCT
    deleteProduct: async (req, res, next) => {
        let image = await productModel.findById({ _id: req.body.id }).lean()
        let final = image.image;
        final.forEach(data => {
            fs.unlinkSync('public/' + data);
        })
        try {
            let data = await productModel.findByIdAndDelete({ _id: req.body.id })
            res.json({ status: 200 })
        }
        catch (err) {
            next(err);
        }
    }
}