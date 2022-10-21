var session = require('express-session');
const orderModel = require('../../models/order-model')
const productHelper = require('../../helpers/product-helpers');
const adminhelper = require("../../helpers/admin-helper");
const { isObjectIdOrHexString } = require('mongoose');


module.exports = {
    getOrders: async (req, res, next) => {
        try {
            session = req, session
            const data = await orderModel.find({}).sort({ createdAt: -1 })
                .populate("userID")
                .populate("products.productId")
                .lean();
            res.render('admin/manage-order', { admin: true, session, data })
        }
        catch (err) {
            next(err)
        }
    },
    changePaymentStatus: async (req, res, next) => {
        try {
            orderId = req.body.id;
            ordertStatus = req.body.status
            console.log(req.body);
            if (ordertStatus == 'Delivered') {
                await orderModel.updateOne(
                    { _id: orderId },
                    { $set: { orderStatus: "Delivered", paymentStatus: "Confirmed" } }
                );
                res.json({ msg: 'success' });
            } else {
                await orderModel.updateOne(
                    { _id: orderId },
                    { $set: { orderStatus: ordertStatus } }
                );
                res.json({ msg: 'success' });
            }
        }
        catch (err) {
            next(err)
        }
    },
    vieworder: async (req, res, next) => {
        id = req.params._id;
        await productHelper.getSingleOrder(id, (data) => {
            console.log(data.products[0], 'oooo');
            res.render('admin/view-single-order', { session, admin: true, data })
        })

    },
    salesReport: async (req, res, next) => {
        try {
            await adminhelper.salesReport(async (salesdata) => {
                const data = await orderModel.find({ paymentStatus: 'Confirmed' }).sort({ createdAt: -1 })
                    .populate("userID")
                    .populate("products.productId")
                    .lean();
                console.log(salesdata, "dataa");
                res.render('admin/sales-report', { admin: true, data, salesdata })
            })
        }
        catch (err) {
            console.log('err');
        }
    },
    cancelOrder: async (req, res, next) => {
        try {
            let tid = req.body.id
            console.log('sd', tid);
            await orderModel.updateOne(
                { _id: req.body.id },
                { $set: { orderStatus: "Cancelled", paymentStatus: "Cancelled" } }
                , (response) => {
                    console.log(response);
                    res.json({ msg: 'success' });
                });

        }
        catch (err) {
            next(err)
        }
    }
}