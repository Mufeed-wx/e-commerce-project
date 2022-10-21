const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let addressSchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true       
    },
    name : {
      type: String,
    },
    mobile_number: {
      type: Number,
    },
    pincode : {
      type : Number,
    },
    street : {
      type : String,
    },
    landmark : {
      type : String,
    },
    city : {
      type : String,
    },
    country : {
      type : String,
    },
    state : {
      type : String,
    },
});

const address = mongoose.model('address', addressSchema);
module.exports = address;
