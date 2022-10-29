const mongoose = require('mongoose')
const adminModel = require('../models/admin-model')
const userModel = require('../models/user-model.js')
const categoryModel = require('../models/category-model')
const subCategoryModel = require('../models/sub-category')
const sessions = require('express-session')
const bcrypt = require('bcrypt')
const couponModel = require('../models/coupon-model')
const productModel = require('../models/product-model')
const orderModel = require('../models/order-model')

module.exports = {
    // Add and Admin verification
    verifyLogin: (data) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                status: false,
                userNotFound: false,
            }
            // data.password = await bcrypt.hash(data.password, 10);
            // adminModel.create(data).then(async (data) => {
            //     console.log("admin create");
            //     resolve(response);
            // })

            let admin = await adminModel.findOne({ email: data.email })
            if (admin) {
                bcrypt.compare(data.password, admin.password, (err, valid) => {
                    if (valid) {
                        response.status = true
                        response.admin = admin
                        resolve(response)
                    } else {
                        response.userNotFound = true
                        resolve(response)
                    }
                })
            } else {
                response.userNotFound = true
                response.status = false
                resolve(response)
            }
        })
    },

    //GET CART DATA
    getUserData: () => {
        return new Promise(async (resolve, reject) => {
            let users = await userModel.find().lean()
            resolve(users)
        })
    },

    //BLOCK USER - ADMIN SIDE
    block_user: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findByIdAndUpdate({ _id: Object(id) })
            user.User_status = false
            await userModel.updateOne({ _id: Object(id) }, user)
            resolve('true')
        })
    },

    //ACTIVE USER - ADMIN SIDE
    active_user: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById({ _id: Object(id) })
            user.User_status = true
            await userModel.updateOne({ _id: Object(id) }, user)
            resolve('its done')
        })
    },

    //ADD CATEGORY 
    addCategory: (category_data) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                categoryExist: false,
            }
            let user = await categoryModel.findOne({
                Category_Name: category_data.Category_Name,
            })
            if (user) {
                response.categoryExist = true
                resolve(response)
            } else {
                categoryModel.create(category_data).then(async (data) => {
                    response.categoryExist = false
                    resolve(response)
                })
            }
        })
    },
    getCategory: () => {
        return new Promise(async (resolve, reject) => {
            let category = await categoryModel.find({}).lean()
            resolve(category)
        })
    },
    deleteCategory: (userid) => {
        return new Promise(async (resolve, reject) => {
            let data = await categoryModel.findByIdAndDelete({ _id: userid })
            if (data) {
                resolve(data)
            } else {
                resolve(data)
            }
        })
    },
    editCategory: (category_data) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                categoryExist: false,
            }
            let user = await categoryModel.findOne({
                Category_Name: category_data.Category_Name,
            })
            if (user) {
                response.categoryExist = true
                resolve(response)
            } else {
                let user = await categoryModel.findById({ _id: category_data.id })
                console.log(user)
                user.Category_Name = category_data.Category_Name
                console.log('dadadada')
                console.log(user)
                response.categoryExist = false
                await categoryModel.updateOne({ _id: category_data.id }, user)
                resolve(response)
                //  })
            }
        })
    },
    addSubCategory: (category_data) => {
        return new Promise(async (resolve, reject) => {
            console.log('looooooooooooo')
            let response = {
                subcategoryExist: false,
            }
            let user = await subCategoryModel.findOne({
                Sub_Category_Name: category_data.Sub_Category_Name,
            })
            if (user) {
                console.log('vaaaaaaaaaaaaaaaaaaaaaaaa')
                response.subcategoryExist = true
                resolve(response)
            } else {
                console.log('daaaaaaaaaaaaaaaaaaaaaaa')
                let datas = await categoryModel.findOne({
                    Category_Name: category_data.Category_Name,
                })
                const ID = datas._id
                const category = {
                    Sub_Category_Name: category_data.Sub_Category_Name,
                    Category_name: ID,
                }
                subCategoryModel.create(category).then(async (data) => {
                    console.log('subcategory create')
                    console.log(data)
                    response.subcategoryExist = false
                    resolve(response)
                })
            }
        })
    },

    getSubCategory: () => {
        return new Promise(async (resolve, reject) => {
            let subcategory = await subCategoryModel
                .find({})
                .populate('Category_name')
                .lean()
            console.log('get sub category')
            resolve(subcategory)
        })
    },
    deleteSubcategory: (userid) => {
        return new Promise(async (resolve, reject) => {
            let data = await subCategoryModel.findByIdAndDelete({ _id: userid })
            if (data) {
                resolve(data)
            } else {
                console.log('error occured subcategory deletion')
                resolve(data)
            }
        })
    },
    addCoupon: async (data, cb) => {
        try {
            var response = false
            console.log(data, 'fafaf')
            const couponExist = await couponModel.findOne({ name: data.code })
            if (couponExist) {
                response = false
                cb(response)
            } else {
                data.name = data.name.toUpperCase()
                data.code = data.code.toUpperCase()
                const newCoupon = new couponModel(data)
                newCoupon.save().then(() => {
                    response = true
                    return response
                })
            }
        } catch (err) {
            return err
        }
    },
    salesReport: async (cb) => {
        try {
            let totalUsers = await userModel.countDocuments().lean()
            let totalProducts = await productModel.countDocuments().lean()
            let CODCount = await orderModel
                .find({ paymentMethod: 'COD' })
                .countDocuments()
                .lean()
            let totalSale = await orderModel.countDocuments().lean()

            let totalPendingOrders = await orderModel
                .find({
                    orderStatus: { $ne: 'Cancelled' },
                    orderStatus: { $ne: 'Delivered' },
                })
                .countDocuments()
                .lean()

            let totalDelivered = await orderModel
                .find({ orderStatus: 'Delivered' })
                .countDocuments()
                .lean()
            let totalPacked = await orderModel
                .find({ orderStatus: 'Packed' })
                .countDocuments()
                .lean()
            let totalShipped = await orderModel
                .find({ orderStatus: 'Shipped' })
                .countDocuments()
                .lean()
            let totalCancelled = await orderModel
                .find({ orderStatus: 'Cancelled' })
                .countDocuments()
                .lean()
            let totalPlaced = await await orderModel
                .find({ orderStatus: 'Placed' })
                .countDocuments()
                .lean()
            totalCancelled = (totalCancelled / totalSale) * 100
            totalDelivered = (totalDelivered / totalSale) * 100
            totalShipped = (totalShipped / totalSale) * 100
            totalPacked = (totalPacked / totalSale) * 100
            totalPlaced = (totalPlaced / totalSale) * 100
            console.log(totalCancelled, totalDelivered, totalPacked, totalShipped)

            let onlinePaymentCount = await orderModel
                .find({ paymentMethod: 'Razorpay' })
                .countDocuments()
                .lean()
            let totalOrders = await orderModel
                .find({ orderStatus: 'Delivered' })
                .countDocuments()
                .lean()
            let ordersData = await orderModel.find({ paymentStatus: 'Confirmed' })
            let totalRevenue = await ordersData.reduce((accumulator, object) => {
                return accumulator + object.finalCost
            }, 0)
            let date = new Date()
            date = date.toUTCString()
            date = date.slice(5, 16)
            let todayRevenue = await orderModel
                .find({ date: date, paymentStatus: 'Confirmed' })
                .lean()
                .then(async (today) => {
                    let TodayRevenue = await today.reduce((accumulator, object) => {
                        return accumulator + object.finalCost
                    }, 0)
                    return TodayRevenue
                })
            let todaySale = await orderModel
                .find({ date: date })
                .countDocuments()
                .lean()
            let dateList = []
            for (let i = 0; i < 10; i++) {
                let d = new Date()
                d.setDate(d.getDate() - i)
                let newDate = d.toUTCString()
                newDate = newDate.slice(5, 16)
                dateList[i] = newDate
            }

            let dateSales = []
            for (let i = 0; i < 10; i++) {
                dateSales[i] = await orderModel
                    .find({ date: dateList[i], paymentStatus: 'Confirmed' })
                    .lean()
                    .then(async (data) => {
                        let total = await data.reduce((accumulator, object) => {
                            return accumulator + object.finalCost
                        }, 0)
                        return total
                    })
            }

            let response = {
                totalProducts: totalProducts,
                totalOrders: totalOrders,
                totalRevenue: totalRevenue,
                todayRevenue: todayRevenue,
                totalSale: totalSale,
                todaySale: todaySale,
                dateList: dateList,
                dateSales: dateSales,
                totalCancelled: totalCancelled,
                totalDelivered: totalDelivered,
                totalPacked: totalPacked,
                totalShipped: totalShipped,
                totalPlaced: totalPlaced,
                CODCount: CODCount,
                onlinePaymentCount: onlinePaymentCount,
                totalPendingOrders: totalPendingOrders,
                totalUsers: totalUsers,
            }
            cb(response)
        } catch (err) {
            cb(err)
        }
    },
}
