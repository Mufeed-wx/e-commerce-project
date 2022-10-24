const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },

}, { timestamps: true })

const addadmin = mongoose.model("admin", userSchema);
module.exports = addadmin;