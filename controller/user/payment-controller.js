var session = require('express-session');
const productHelper = require('../../helpers/product-helpers');
const userhelper = require('../../helpers/user-helper');
const profileHelper = require('../../helpers/profile-helper');
const adminHelper = require('../../helpers/admin-helper');
const userModel = require('../../models/user-model')
const coupenmodel = require('../../models/coupon-model');
const cartModel = require('../../models/cart-model');
const { response } = require('express');
const orderModel = require('../../models/order-model')

module.exports = {
    addressSelect: async (req, res, next) => {
        try {
            session = req.session;
            id = req.session.user._id;
            const userAddress = await profileHelper.getAddress(id);
            console.log("sdfaa", userAddress);
            res.render('user/checkout', { session, userAddress, user: true });
        }
        catch (err) {
            next(err)
        }
    },
    paymentSelect: (req, res) => {
        res.render('user/select-payment', { user: true });
    },
    finalPayment: async (req, res, next) => {
        try {
            session = req.session;
            const id = req.session.user._id;
            let addressId = req.session.checkoutaddressid;
            req.session.coupen = null;
            session.totalAmount = req.session.cartTotal;
            cartData = req.session.cartTotal
            console.log("datas", req.session.cart, 'llllll', req.session.cartTotal);
            const orderAddress = await profileHelper.getAddressById(id, addressId)
            paymentMethod = req.session.paymentmethod
            res.render('user/final-payment', { session, orderAddress, paymentMethod, cartData, user: true });
        }
        catch (err) {
            next(err)
        }

    },
    checkoutData: (req, res, next) => {
        try {
            session = req.session;
            req.session.checkoutaddressid = req.params._id;
            console.log('as', req.session.checkoutaddressid);
            res.render('user/select-payment', { session, user: true })
        }
        catch (err) {
            next(err)
        }
    },
    paymentSelectData: (req, res) => {
        req.session.paymentmethod = req.body.paymentmethod;
        console.log(req.session.paymentsample);
        res.redirect('finalpayment')
    },
    checkCoupen: async (req, res, next) => {

        try {
            if (req.session.coupen) {
                res.json({ msg: 'coupenapplied' });
            } else {
                console.log("ghfhg", req.body);
                ccode = req.body.value
                id = req.session.user._id;
                const data = await coupenmodel.find({ code: ccode }).lean()
                console.log('lalal', data);
                if (data.length != 0) {
                    console.log("reach");
                    var coupenExist = false;
                    let coupen = await userModel.findOne({ _id: id }, { _id: 0, coupons: 1 }).lean()
                    console.log(coupen, "aa", coupen.coupons[0]);
                    for (let i = 0; i < coupen.coupons.length; i++) {
                        if (String(coupen.coupons[i]) === String(data[0]._id)) {
                            console.log("haha");
                            coupenExist = true;
                            break;
                        }
                    }
                    if (coupenExist) {
                        console.log('exist');
                        res.json({ msg: 'coupenExist' });
                    } else {
                        console.log('true');
                        req.session.coupen = data;
                        console.log('kaak', req.session.coupen);
                        res.json({ msg: 'success', data: data });
                    }

                } else {
                    console.log("coupen not found");
                    res.json({ msg: 'coupennotfound' });
                }
            }


        }
        catch (err) {
            next(err)
        }

    },
    checkout: async (req, res, next) => {

        console.log(req.body);
        try {
            const data = {
                userid: req.session.user._id,
                paymentMethod: req.session.paymentmethod,
                cartData: req.session.cart,
                cartTotal: req.session.cartTotal.total,
                coupen: req.session.coupen,
                Final_total: req.body.total_prize,
                address: req.session.checkoutaddressid,
            }
            if (req.session.paymentmethod == "COD") {
                productHelper.checkout(data, async (data) => {
                    await cartModel.findByIdAndUpdate(
                        { _id: req.session.cart._id },
                        { $pull: { Cartdata: {}, multi: true } })
                    const response = {
                        CODstatus: true,
                    };
                    res.json(response);
                })
            }
            else if (req.session.paymentmethod == "Razorpay") {
                try {
                    productHelper.checkout(data, async (orderData) => {
                        console.log('dataa', orderData);
                        req.session.orderid = orderData._id;
                        productHelper.generateRazorpay(orderData._id, data.Final_total, (response) => {
                            console.log("razrpay");
                            console.log(response);
                            req.session.orderID = response.receipt;
                            console.log("req.session.orderID", req.session.orderID);
                            res.json(response);
                        })
                    })
                }
                catch (err) {
                    console.log("error", err);
                }
            }
            else {
                console.log("errra");
            }
        }
        catch (err) {
            next(err)
        }
    },
    verifypayment: (req, res, next) => {
        try {
            console.log("verify payment");
            console.log("req.body", req.body);
            productHelper
                .verifyPayment(req.body, async (response) => {
                    console.log(response, 'ooooallllllllllllllll');
                    id = req.session.orderid;
                    await orderModel.updateOne(
                        { _id: id },
                        { $set: { paymentStatus: "Confirmed" } }
                    );
                    await cartModel.findByIdAndUpdate(
                        { _id: req.session.cart._id },
                        { $pull: { Cartdata: {}, multi: true } })
                    res.json({ status: true });
                })
        }
        catch (err) {
            const data = {};
            data.status = false;
            data.orderID = req.session.orderid;
            res.json(data);
        };
    },
    cancelOrder: async (req, res, next) => {
        try {
            id = req.params.id
            productHelper.cancelOrder(id, (response) => {
            })
        }
        catch (err) {
            next(err)
        }
    }
}
