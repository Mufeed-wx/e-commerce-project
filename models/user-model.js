const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  Company_Name: {
    type: String,
  },
  Company_Address: {
    type: String,
  },
  Mobile_Number: {
    type: String,
  },
  User_Name: {
    type: String,
  },
  User_Email: {
    type: String,
  },
  Password: {
    type: String,
  },
  User_mob: {
    type: String,
  },
  User_status: {
    type: Boolean,
  },
  address :[{
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
  }],
    coupons:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'coupen',
    }],
  button: {
    type: String,
  },
});

const adduser = mongoose.model('user', userSchema);
module.exports = adduser;
