const mongoose = require("mongoose");
const Schema=mongoose.Schema;

let subcategorySchema=new Schema({
    Sub_Category_Name:{
        type:String,
    },
    Category_name:{
        type:Schema.Types.ObjectId,
        ref:'Categories'
    }
},{timeseries:true})

const SubCategory=mongoose.model("SubCategories",subcategorySchema);
module.exports=SubCategory;

