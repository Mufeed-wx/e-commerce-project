const mongoose = require("mongoose");
const Schema=mongoose.Schema;

let wishlistSchema=new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    Wishlistdata:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:'product',
        }
    }]
},{timeseries:true})

const wishlist=mongoose.model("wishlist",wishlistSchema);
module.exports=wishlist;
