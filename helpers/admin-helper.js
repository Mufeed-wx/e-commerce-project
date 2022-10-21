const mongoose = require('mongoose')
const addadmin = require('../models/admin-model')
const adduser = require('../models/user-model.js')
const addCatagory = require('../models/category-model')
const addSubCategory = require('../models/sub-category')
const sessions = require('express-session')
const Promise = require('promise')
const bcrypt = require('bcrypt')
const { resolve, reject } = require('promise')
const model = require('../models/coupen-model')
const coupenmodel = require('../models/coupen-model')
const productmodal = require('../models/product-modal')
const ordermodel = require('../models/order-model')

const { castObject } = require('../models/category-model')
const { response } = require('express')

module.exports = {
    adminlogin: (adminlogin) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                status: false,
                usernotfound: false,
            }
            // adminlogin.password = await bcrypt.hash(adminlogin.password, 10);
            // addadmin.create(adminlogin).then(async(data)=>{
            //     console.log("admin create");
            //     resolve(response);
            //   })

            let admin = await addadmin.findOne({ mailid: adminlogin.mailid })
            if (admin) {
                bcrypt.compare(adminlogin.password, admin.password, (err, valid) => {
                    if (valid) {
                        response.status = true
                        response.admin = admin

                        resolve(response)
                        console.log('success b')
                    } else {
                        response.usernotfound = true
                        resolve(response)
                    }
                })
            } else {
                response.usernotfound = true
                response.status = false
                resolve(response)
            }
        })
    },

    getuserdata: () => {
        return new Promise(async (resolve, reject) => {
            let users = await adduser.find().lean()
            resolve(users)
        })
    },
    block_user: (id) => {
        console.log('vadadsdfsd')
        return new Promise(async (resolve, reject) => {
            let user = await adduser.findByIdAndUpdate({ _id: Object(id) })
            user.User_status = false
            console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            console.log(user)
            await adduser.updateOne({ _id: Object(id) }, user)
            resolve('got it')
        })
    },

    active_user: (id) => {
        console.log('daaaaaaaaaaaam')
        return new Promise(async (resolve, reject) => {
            let user = await adduser.findById({ _id: Object(id) })
            user.User_status = true
            await adduser.updateOne({ _id: Object(id) }, user)
            resolve('its done')
        })
    },
    addCategory: (category_data) => {
        return new Promise(async (resolve, reject) => {
            console.log('looooooooooooo')
            let response = {
                categoryexist: false,
            }
            let user = await addCatagory.findOne({
                Category_Name: category_data.Category_Name,
            })
            if (user) {
                response.categoryexist = true
                resolve(response)
            } else {
                addCatagory.create(category_data).then(async (data) => {
                    console.log('category create')
                    console.log(data)
                    response.categoryexist = false
                    resolve(response)
                })
            }
        })
    },
    getcategory: () => {
        return new Promise(async (resolve, reject) => {
            let category = await addCatagory.find({}).lean()
            resolve(category)
        })
    },
    deletecategory: (userid) => {
        return new Promise(async (resolve, reject) => {
            let data = await addCatagory.findByIdAndDelete({ _id: userid })
            if (data) {
                resolve(data)
            } else {
                console.log('error occured deletion')
                resolve(data)
            }
        })
    },
    editCategory: (category_data) => {
        return new Promise(async (resolve, reject) => {
            console.log('kooooooooooooo')
            let response = {
                categoryexist: false,
            }
            let user = await addCatagory.findOne({
                Category_Name: category_data.Category_Name,
            })
            if (user) {
                response.categoryexist = true
                resolve(response)
            } else {
                let user = await addCatagory.findById({ _id: category_data._id })
                console.log(user)
                user.Category_Name = category_data.Category_Name
                console.log('dadadada')
                console.log(user)
                response.categoryexist = false
                await addCatagory.updateOne({ _id: category_data._id }, user)
                resolve(response)
                //  })
            }
        })
    },
    addsubCategory: (category_data) => {
        return new Promise(async (resolve, reject) => {
            console.log('looooooooooooo')
            let response = {
                subcategoryexist: false,
            }
            let user = await addSubCategory.findOne({
                Sub_Category_Name: category_data.Sub_Category_Name,
            })
            if (user) {
                console.log('vaaaaaaaaaaaaaaaaaaaaaaaa')
                response.subcategoryexist = true
                resolve(response)
            } else {
                console.log('daaaaaaaaaaaaaaaaaaaaaaa')
                let datas = await addCatagory.findOne({
                    Category_Name: category_data.Category_Name,
                })
                const ID = datas._id
                const category = {
                    Sub_Category_Name: category_data.Sub_Category_Name,
                    Category_name: ID,
                }
                addSubCategory.create(category).then(async (data) => {
                    console.log('subcategory create')
                    console.log(data)
                    response.subcategoryexist = false
                    resolve(response)
                })
            }
        })
    },

    getsubcategory: () => {
        return new Promise(async (resolve, reject) => {
            let subcategory = await addSubCategory
                .find({})
                .populate('Category_name')
                .lean()
            console.log('get sub category')
            console.log(subcategory)
            resolve(subcategory)
        })
    },
    deletesubcategory: (userid) => {
        return new Promise(async (resolve, reject) => {
            let data = await addSubCategory.findByIdAndDelete({ _id: userid })
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
            const couponExist = await coupenmodel.findOne({ name: data.code })
            if (couponExist) {
                response = false
                cb(response)
            } else {
                data.name = data.name.toUpperCase()
                data.code = data.code.toUpperCase()
                const newCoupon = new coupenmodel(data)
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
            let totalUsers = await adduser.countDocuments().lean()
            let totalProducts = await productmodal.countDocuments().lean()
            let CODCount = await ordermodel.find({ paymentMethod: 'COD' }).countDocuments().lean()
            let totalSale = await ordermodel.countDocuments().lean()

            let totalPendingOrders = await ordermodel.find({ orderStatus: { $ne: "Cancelled" }, orderStatus: { $ne: "Delivered" } }).countDocuments().lean()

            let totalDelivered = await ordermodel.find({ orderStatus: "Delivered" }).countDocuments().lean()
            let totalPacked = await ordermodel.find({ orderStatus: "Packed" }).countDocuments().lean()
            let totalShipped = await ordermodel.find({ orderStatus: "Shipped" }).countDocuments().lean()
            let totalCancelled = await ordermodel.find({ orderStatus: "Cancelled" }).countDocuments().lean()
            let totalPlaced = await await ordermodel.find({ orderStatus: "Placed" }).countDocuments().lean()
            totalCancelled = (totalCancelled / totalSale) * 100;
            totalDelivered = (totalDelivered / totalSale) * 100;
            totalShipped = (totalShipped / totalSale) * 100;
            totalPacked = (totalPacked / totalSale) * 100;
            totalPlaced = (totalPlaced / totalSale) * 100;
            console.log(totalCancelled, totalDelivered, totalPacked, totalShipped);

            let onlinePaymentCount = await ordermodel.find({ paymentMethod: 'Razorpay' }).countDocuments().lean()
            let totalOrders = await ordermodel
                .find({ orderStatus: 'Delivered' })
                .countDocuments()
                .lean()
            let ordersData = await ordermodel.find({ paymentStatus: 'Confirmed' })
            let totalRevenue = await ordersData.reduce((accumulator, object) => {
                return accumulator + object.finalCost
            }, 0)
            let date = new Date()
            date = date.toUTCString()
            date = date.slice(5, 16)
            let todayRevenue = await ordermodel
                .find({ date: date, paymentStatus: 'Confirmed' })
                .lean()
                .then(async (today) => {
                    let TodayRevenue = await today.reduce((accumulator, object) => {
                        return accumulator + object.finalCost
                    }, 0)
                    return TodayRevenue
                })
            let todaySale = await ordermodel.find({ date: date }).countDocuments().lean()
            let dateList = [];
            for (let i = 0; i < 10; i++) {
                let d = new Date();
                d.setDate(d.getDate() - i);
                let newDate = d.toUTCString();
                newDate = newDate.slice(5, 16);
                dateList[i] = newDate;
            }

            let dateSales = [];
            for (let i = 0; i < 10; i++) {
                dateSales[i] = await ordermodel
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
        }
        catch (err) {
            cb(err)
        }
    },
}
