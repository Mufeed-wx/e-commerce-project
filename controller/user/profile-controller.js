var session = require('express-session');
let productHelper = require('../../helpers/product-helpers');
const userhelper = require('../../helpers/user-helper');
const usermodel = require('../../models/user-model')
const profileHelper = require('../../helpers/profile-helper');
const userHelper = require('../../helpers/user-helper');
const bcrypt = require('bcrypt');

module.exports = {
    viewProfile: async (req, res, next) => {
        try {
            session = req.session;
            const id = req.session.user._id;
            await userHelper.getUserData(id, (err, data) => {
                console.log("datataatat", data.Company_Name);
                res.render('user/profile', { session, data, user: true });
            })
        }
        catch (err) {
            next(err);
        }
    },

    editUserData: async (req, res, next) => {
        try {
            id = req.session.user._id
            session = req.session;
            await userHelper.getUserData(id, (err, data) => {
                console.log("datataatat", data.Company_Name);
                res.render('user/edit-user-data', { session, data, user: true })
            })
        }
        catch (err) {
            next(err)
        }
    },
    viewUserAddress: async (req, res, next) => {
        session = req.session;
        const ID = req.session.user._id;
        try {
            var address = await usermodel.findById({ _id: ID }, { _id: 0, address: 1 }).lean()
            if (address.address.length != 0) {
                userAddress = address.address
                res.render('user/view-user-address', { userAddress, user: true, session })
            } else {
                console.log("gagagagagag");
                res.render('user/view-user-address', { user: true, session })

            }

        }
        catch (err) {
            next(err)
        }
    },
    editUserAddress: async (req, res, next) => {
        try {
            session = req.session;
            const id = req.session.user._id;
            const addressId = req.params._id
            const addresses = await usermodel.findOne({ _id: id }, { _id: 0, address: 1 }).lean()
            let address;
            for (let i = 0; i < addresses.address.length; i++) {
                if (addresses.address[i]._id == addressId) {
                    address = addresses.address[i];
                    break;
                }
            }
            res.render('user/edit-user-address', { session, address, user: true })
        }
        catch (err) {
            next(err)
        }

    },
    addUserAddress: (req, res) => {
        session = req.session;
        res.render('user/add-user-address', { session, user: true })
    },

    addUserAddressData: async (req, res, next) => {
        const ID = req.session.user._id;
        try {
            await usermodel.findOneAndUpdate({ _id: ID }, { $push: { address: req.body } })
            res.redirect('/view-address')
        }
        catch (err) {
            next(err)
        }
    },
    deleteUserAddress: async (req, res, next) => {
        try {
            const ID = req.session.user._id;
            addressId = req.body.id;
            await usermodel.updateOne({ _id: ID }, { $pull: { address: { _id: addressId } } }, (data) => {
                res.json({ msg: 'success' });
            })
        }
        catch (err) {
            console.log('err');
        }
    },
    editAddress: async (req, res, next) => {
        try {
            const ID = req.session.user._id;
            const addressId = req.params._id
            const userData = await usermodel.findOneAndUpdate(
                { _id: ID, "address._id": addressId },
                {
                    $set: {
                        "address.$.name": req.body.name,
                        "address.$.mobile_number": req.body.mobile_number,
                        "address.$.pincode": req.body.pincode,
                        "address.$.street": req.body.street,
                        "address.$.landmark": req.body.landmark,
                        "address.$.city": req.body.city,
                        "address.$.country": req.body.country,
                        "address.$.state:": req.body.state,
                    },
                }
            );
            res.redirect('/view-address')
        }
        catch (err) {
            next(err)
        }

    },
    editPersonalData: async (req, res, next) => {
        id = req.session.user._id;
        console.log(req.body);
        try {
            const user = await usermodel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        User_Name: req.body.User_Name,
                        User_Email: req.body.User_Email,
                        Company_Name: req.body.Company_Name,
                        Mobile_Number: req.body.Mobile_Number
                    }
                })
            res.redirect('/profile')

        }
        catch (err) {
            next(err)
        }
    },
    changePassword: async (req, res, next) => {
        id = req.session.user._id
        Password = req.body.oldPassword;
        newPassword = req.body.Password
        console.log('password', Password);
        try {
            let user = await usermodel.findOne({ _id: id });
            if (user) {
                bcrypt.compare(Password, user.Password, async (err, valid) => {
                    if (valid) {
                        newPassword = await bcrypt.hash(newPassword, 10);
                        usermodel.findOneAndUpdate({ _id: id }, { Password: newPassword }, (response) => {
                            res.json({ msg: 'success' });
                        })
                    }
                    else {
                        res.json({ msg: 'passwordnotequal' });
                    }
                })
            }
        }
        catch (error) {
            next(error)
        }
    }
}
