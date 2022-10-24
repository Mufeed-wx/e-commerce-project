const session = require("express-session")
const { resolve } = require("promise")
const promise = require("promise")
const orderModel = require('../models/order-model')
var fs = require('fs')
const userModel = require('../models/user-model')
const productcontrol = require('../models/product-modal')
const couponModel = require('../models/coupon-model')
const Razorpay = require("razorpay");


var instance = new Razorpay({
    key_id: process.env.RAZ_KEYID,
    key_secret: process.env.RAZ_SECRET,
});


module.exports = {
    addproduct: (product) => {
        return new promise(async (resolve, reject) => {
            let response = {
            }
            let category_id
            productcontrol.create(product).then(async (data) => {
                resolve(data)
            })
        })
    },

    getproduct: () => {
        return new Promise(async (resolve, reject) => {
            let product = await productcontrol.find().populate('Category_Name').populate('Sub_Category_Name').lean()
            resolve(product)
        })
    },

    getproduct_data: () => {
        let product = {
            vegiatable: null,
            fruites: null,
        }
        return new Promise(async (resolve, reject) => {

            let vegiatable = await productcontrol.find({ Category_Name: "631a1cb6ac7d688f5141cb1b" }).populate('Category_Name').populate('Sub_Category_Name').lean()
            let fruites = await productcontrol.find({ Category_Name: "631a1cc2ac7d688f5141cb25" }).populate('Category_Name').populate('Sub_Category_Name').lean()
            product.vegiatable = vegiatable;
            product.fruites = fruites;
            resolve(product)

        })
    },

    getproductByid: (id) => {
        return new Promise(async (resolve, reject) => {
            let product = await productcontrol.findById({ _id: id._id }).populate('Category_Name').populate('Sub_Category_Name').lean()
            resolve(product)
        })
    },

    EditproductByid: (data) => {
        return new Promise(async (resolve, reject) => {
            let id = data._id;
            let image = await productcontrol.findById({ _id: data._id }).lean()
            let final = image.image;
            console.log("lalaaaaaaaaaaa", final);
            final.forEach(data => {
                fs.unlinkSync('public/' + data);
            })
            let product = await productcontrol.findByIdAndUpdate({ _id: data._id }, data)
            resolve(product)
        })
    },
    checkout: async (data, cb) => {
        try {
            let Cdata = data.cartData.Cartdata
            console.log('cdata', Cdata);
            let totalQuantity = await Cdata.reduce((accumulator, object) => {
                return accumulator + object.quantity
            }, 0)
            const status =
                data.paymentMethod === "COD"
                    ? "In Progress"
                    : "Pending";
            if (data.coupen) {
                coupen = data.coupen[0].name;
                discount = data.coupen[0].Discountprice
                coupenid = data.coupen[0]._id
                await userModel.findOneAndUpdate({ _id: data.userid }, { $push: { coupons: coupenid } })
            } else {
                coupen = null
                discount = 0
            }
            let date = new Date();
            date = date.toUTCString();
            date = date.slice(5, 16);
            const orderDetails = {
                userID: data.userid,
                products: data.cartData.Cartdata,
                totalCost: data.cartTotal,
                coupon: coupen,
                discount: discount,
                finalCost: data.Final_total,
                paymentMethod: data.paymentMethod,
                address: data.address,
                paymentStatus: status,
                orderStatus: "Placed",
                totallQuantity: totalQuantity,
                date: date,
            };
            const newOrder = new orderModel(orderDetails);
            await newOrder.save().then((response) => {
                cb(response)
            })
        }
        catch (err) {
            cb(err)
        }
    },

    //GENERATE RAZORPAY
    generateRazorpay: (orderID, amount, cb) => {
        console.log(orderID, amount, 'laaaaaaaaaaaaaaaaaaaaaa');
        try {
            orderID = orderID.toString();
            const Amount = parseInt(amount);
            const options = {
                amount: Amount * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: orderID,
                // ''+orderID
            };
            instance.orders.create(options, function (err, order) {
                if (order) {
                    console.log("NEW ORDER", order);
                    cb(order);
                } else {
                    console.log("ERROR", err);
                }
            });
        } catch (err) {
            console.log('error occured');
            cb(err);
        }
    },
    verifyPayment: (details, cb) => {
        try {
            console.log('veriyPAYMENT')
            const crypto = require("crypto");
            let expectedSignature = crypto.createHmac(
                "sha256",
                "sha256"
            );
            expectedSignature.update(
                details["payment[razorpay_order_id]"] +
                "|" +
                details["payment[razorpay_payment_id]"]
            );
            expectedSignature = expectedSignature.digest("hex");
            if (expectedSignature == details["payment[razorpay_signature]"]) {
                cb();
            } else {
                cb();
            }
        } catch (err) {
            cb(err);
        }
    },

    //CANCEL ORDER
    cancelOrder: async (orderID, cb) => {
        await orderModel.updateOne(
            { _id: orderID },
            { $set: { orderStatus: "Cancelled", paymentStatus: "Cancelled" } }
            , (response) => {
                cb(true)
            });


    },

    //GET ALL COUPONS DATA
    getCoupons: async (cb) => {
        try {
            const Coupons = await couponModel.find().lean();
            cb(Coupons);
        } catch (err) {
            cb(err);
        }
    },
    //EDIT COUPON
    editCoupon: (couponID, cb) => {
        return new Promise(async (resolve, reject) => {
            try {
                const coupon = await couponModel.findOne({ _id: couponID }).lean();
                cb(coupon);
            } catch (error) {
                cb(error);
            }
        });
    },
    updateCoupon: async (id, data, cb) => {
        try {
            data.name = data.name.toUpperCase();
            data.code = data.code.toUpperCase();
            await couponModel.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        name: data.name,
                        code: data.code,
                        Discountprice: data.Discountprice,
                        Coupenlimit: data.Coupenlimit,
                    },
                }
            );
            cb(true);
        } catch (err) {
            cb(err);
        }
    },
    //DELETE COUPON
    deleteCoupon: async (id, cb) => {
        try {
            console.log('gagaga', id);
            await couponModel.deleteOne({ _id: id });
            cb(true)
        } catch (err) {
            cb(err);
        }
    },

    getSingleOrder: async (orderID, cb) => {
        const data = await orderModel.findById({ _id: orderID }).populate("userID")
            .populate("products.productId")
            .lean();
        cb(data)
    },
}
