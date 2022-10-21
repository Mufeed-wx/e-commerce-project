const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CoupenSchema = new mongoose.Schema({
    user_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    name:{
        type:String
    },
    code:{
        type:String
    },
    Discountprice:{
        type:'number'
    },
    Coupenlimit:{
        type:'number'
    },
    Date:{
        type:'String'
    },

},{timestamps:true})

const coupenmodel = mongoose.model('coupen',CoupenSchema)

module.exports = coupenmodel