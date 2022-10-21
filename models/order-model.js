const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId, ref: 'product',
        },
        quantity: Number,
    }],
    totalCost: {
        type: Number,
        default: 0
    },
    coupon: {
        type: String,
        default: null,
        // mongoose.Schema.Types.ObjectId, ref:('coupons')
    },
    discount: {
        type: Number,
        default: 0
    },
    finalCost: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String
    },
    address: {
        type: Schema.Types.ObjectId, ref: ('user')
    },
    paymentStatus: {
        type: String
    },
    orderStatus: {
        type: String,
        default: 'Placed'
    },
    totallQuantity: {
        type: Number,
        default: '0'
    },
    date: {
        type: String
    },

},
    { timestamps: true })

const orders = mongoose.model('order', orderSchema)

module.exports = orders;