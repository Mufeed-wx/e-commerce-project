const session = require("express-session")
const { resolve, reject } = require("promise")
const promise = require("promise")
const userhomeController = require("../models/carousel-model")
const productController = require("../models/product-modal")
var fs = require('fs')

module.exports = {
    addCurousel: (data) => {
        console.log("haaaaaaa", data);
        return new Promise(async (resolve, reject) => {
            let image = await userhomeController.findById({ _id: data._id }).lean()
            let final = image.image;
            console.log("lamaaaaa", final);
            final.forEach(data => {
                fs.unlinkSync('public/img/curousel/' + data);
            })
            let item = await userhomeController.findByIdAndUpdate({ _id: data._id }, data)
            resolve(item)

        })
    },
    getCurousel: () => {
        return new promise(async (resolve, reject) => {
            let data = await userhomeController.find().lean()
            resolve(data)
        })
    }
}