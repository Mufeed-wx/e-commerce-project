const mongoose = require("mongoose");
const Schema=mongoose.Schema;

let userSchema=new Schema({
    mailid:{
        type:String,
    },
    password:{
        type:String,
    },
})

const addadmin=mongoose.model("admin",userSchema);
module.exports=addadmin;