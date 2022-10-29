var session = require('express-session');
const orderModel = require('../../models/order-model')
const productHelper = require('../../helpers/product-helpers');
const adminHelper = require("../../helpers/admin-helper");

module.exports = {
    //VIEW ORDER MANAGEMENT PAGE
    getOrders: async (req, res, next) => {
        try {
            session = req, session
            const data = await orderModel.find({}).sort({ createdAt: -1 })
                .populate("userID")
                .populate("products.productId")
                .lean();
            res.render('admin/order-management', { admin: true, session, data })
        }
        catch (err) {
            next(err)
        }
    },
    //CHANGE ORDER STATUS
    changePaymentStatus: async (req, res, next) => {
        try {
            orderId = req.body.id;
            orderStatus = req.body.status;
            if (orderStatus == 'Delivered') {
                await orderModel.updateOne(
                    { _id: orderId },
                    { $set: { orderStatus: "Delivered", paymentStatus: "Confirmed" } }
                );
                res.json({ msg: 'success' });
            } else {
                await orderModel.updateOne(
                    { _id: orderId },
                    { $set: { orderStatus: orderStatus } }
                );
                res.json({ msg: 'success' });
            }
        }
        catch (err) {
            next(err)
        }
    },
    //VIEW SINGLE ORDER DATA
    viewOrder: async (req, res, next) => {
        id = req.params._id;
        await productHelper.getSingleOrder(id, (data) => {
            res.render('admin/view-single-order', { session, admin: true, data })
        })
    },
    //VIEW SALES REPORT
    salesReport: async (req, res, next) => {
        try {
            await adminHelper.salesReport(async (salesData) => {
                const data = await orderModel.find({ paymentStatus: 'Confirmed' }).sort({ createdAt: -1 })
                    .populate("userID")
                    .populate("products.productId")
                    .lean();
                res.render('admin/sales-report', { admin: true, data, salesData })
            })
        }
        catch (err) {
            console.log('err');
        }
    },
    //CANCEL ORDERS
    cancelOrder: async (req, res, next) => {
        try {
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