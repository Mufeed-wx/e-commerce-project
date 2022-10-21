const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    require:true
    
},
Cartdata:[{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        require:true 
 }, 
     quantity:'number'
}]
},{timestamps:true})

const cartmodel = mongoose.model('carts',cartSchema)
module.exports = cartmodel;