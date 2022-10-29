const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let productSchema = new Schema({
    Product_Name: {
        type: String,
    },
    Category_Name: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    Sub_Category_Name: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategories'
    },
    Product_Description: {
        type: String,
    },
    Product_Prize: {
        type: Number,
    },
    order_limit: {
        type: Number,
    },
    Total_Stock: {
        type: Number,
    },
    Discount: {
        type: Number,
    },
    image: {
        type: Array,
    },
}, { timestamps: true })

const productcontrol = mongoose.model("product", productSchema);
module.exports = productcontrol;