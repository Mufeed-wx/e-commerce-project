var session = require('express-session');
const productHelper = require('../../helpers/product-helpers');
const userHelper = require('../../helpers/user-helper');
const profileHelper = require('../../helpers/profile-helper');
const adminHelper = require('../../helpers/admin-helper');
const userModel = require('../../models/user-model')
const couponModel = require('../../models/coupon-model');
const cartModel = require('../../models/cart-model');
const orderModel = require('../../models/order-model')

module.exports = {
    //ADDRESS PAGE OF PLACE ORDER
    addressSelect: async (req, res, next) => {
        try {
            session = req.session;
            id = req.session.user._id;
            const userAddress = await profileHelper.getAddress(id);
            res.render('user/checkout', { session, userAddress, user: true });
        }
        catch (err) {
            next(err)
        }
    },
    //FINAL PLACE ORDER PAGE
    finalPayment: async (req, res, next) => {
        try {
            session = req.session;
            const id = req.session.user._id;
            let addressId = req.session.checkoutAddressId;
            req.session.coupon = null;
            session.totalAmount = req.session.cartTotal;
            cartData = req.session.cartTotal
            const orderAddress = await profileHelper.getAddressById(id, addressId)
            paymentMethod = req.session.paymentMethod
            res.render('user/final-payment', { session, orderAddress, paymentMethod, cartData, user: true });
        }
        catch (err) {
            next(err)
        }

    },
    //PAYMENT SELECTION OF PLACE ORDER
    paymentSelect: (req, res, next) => {
        try {
            session = req.session;
            req.session.checkoutAddressId = req.params._id;
            res.render('user/select-payment', { session, user: true })
        }
        catch (err) {
            next(err)
        }
    },
    //PAYMENT DATA OF PLACE ORDER
    paymentSelectData: (req, res) => {
        req.session.paymentMethod = req.body.paymentMethod;
        res.redirect('place-order')
    },
    //CHECK COUPON OF PLACE ORDER
    checkCoupon: async (req, res, next) => {
        try {
            if (req.session.coupon) {
                res.json({ msg: 'couponApplied' });
            } else {

                couponCode = req.body.value
                id = req.session.user._id;
                const data = await couponModel.find({ code: couponCode }).lean()
                if (data.length != 0) {
                    var couponExist = false;
                    let coupon = await userModel.findOne({ _id: id }, { _id: 0, coupons: 1 }).lean()
                    for (let i = 0; i < coupon.coupons.length; i++) {
                        if (String(coupon.coupons[i]) === String(data[0]._id)) {
                            couponExist = true;
                            break;
                        }
                    }
                    if (couponExist) {
                        res.json({ msg: 'couponExist' });
                    } else {
                        req.session.coupon = data;
                        res.json({ msg: 'success', data: data });
                    }

                } else {
                    console.log('jjj');
                    res.json({ msg: 'couponNotFound' });
                }
            }
        }
        catch (err) {
            next(err)
        }
    },
    //FINAL STAGE OF PLACE ORDER
    placeOrder: async (req, res, next) => {
        console.log(req.body);
        try {
            const data = {
                userid: req.session.user._id,
                paymentMethod: req.session.paymentMethod,
                cartData: req.session.cart,
                cartTotal: req.session.cartTotal.total,
                coupen: req.session.coupon,
                Final_total: req.body.total_prize,
                address: req.session.checkoutAddressId,
            }
            if (req.session.paymentMethod == "COD") {
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
            else if (req.session.paymentMethod == "Razorpay") {
                try {
                    productHelper.checkout(data, async (orderData) => {
                        req.session.orderId = orderData._id;
                        productHelper.generateRazorPay(orderData._id, data.Final_total, (response) => {
                            req.session.orderId = response.receipt;
                            res.json(response);
                        })
                    })
                }
                catch (err) {
                    throw new Error(err)
                }
            }
            else {
                throw new Error('error')
            }
        }
        catch (err) {
            next(err)
        }
    },
    //VERIFY USER PAYMENT DATA
    verifyPayment: (req, res, next) => {
        try {
            productHelper
                .verifyPayment(req.body, async (response) => {
                    id = req.session.orderId;
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
            data.orderID = req.session.orderId;
            res.json(data);
        };
    },
    //ORDER CANCELLATION
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
