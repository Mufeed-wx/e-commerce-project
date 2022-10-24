const mongoose = require('mongoose')
const Schema = mongoose.Schema
const couponSchema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    Discountprice: {
        type: 'number'
    },
    Coupenlimit: {
        type: 'number'
    },
    Date: {
        type: 'String'
    },

}, { timestamps: true })

const couponModel = mongoose.model('coupon', couponSchema)

module.exports = couponModel