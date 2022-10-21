const session = require("express-session")
const { resolve } = require("promise")
const userModel = require ('.././models/user-model')

module.exports = {
    getAddress : async (id) => {   
           const address = await userModel.findById({_id:id},{_id:0,address : 1}).lean()
           return(address);      
    },
    getAddressById : async (id,addressId) => {
        const addresses = await userModel.findOne({_id: id},{_id:0,address : 1}).lean()
        let address;
        for (let i = 0; i < addresses.address.length; i++) {
          if (addresses.address[i]._id == addressId) {
            address = addresses.address[i];
            break;
          }
        }
        return(address)
    }
}



