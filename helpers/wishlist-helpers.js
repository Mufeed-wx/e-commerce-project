const session = require("express-session")
const { resolve } = require("promise")
const promise = require("promise")


const wishlistcontroller = require('../models/wishlist-model')
module.exports = {
    addwishlist: (userid, productid) => {
        console.log(userid, "wishlist useriddd");
        console.log(productid, "wishlist prooos id");
        const response = {
            duplicate: false
        }
        return new Promise(async (resolve, reject) => {
           
            try {
                let wishlist = await wishlistcontroller.findOne({ user_id: userid })
                console.log("hahssah",wishlist);
                if (wishlist) {
                    let wishproducts = await wishlistcontroller.findOne({
                        user_id: userid,
                        "Wishlistdata.productId": productid
                    })
                    console.log(wishlist, "iiiiiiiiiiiiiiiii");
                    if (wishproducts) {
                        // wishlist.updateOne(
                        //     {userId : userid, "Wishlistdata.productId" : productid}
                        // ).then((response)=>{
                        response.duplicate = true;
                        resolve(response)
                    } else {
                        let wishArry = { productId: productid };
                        wishlistcontroller.updateOne({ user_id: userid }, {
                            $push: { Wishlistdata: wishArry }
                        }).then((response) => {
                            console.log(response, "kkkkkkkkkk");
                            resolve(response)
                        });
                    }


                } else {
                    console.log("kayari");
                    let wishlistobj = new wishlistcontroller({
                        user_id: userid,
                        Wishlistdata: [{ productId: productid }],
                    })
                    wishlistobj.save().then((response) => {
                        console.log("wishlist response", response);
                        resolve(response)
                    }).catch((err) => {
                        console.log("error", err);
                    })

                }

            } catch (error) {
                reject(error)
            }
        })


    },
    getwishlistItems:(userid)=>{
        try{
        return new Promise(async(resolve, reject)=>{
            const response={}
            wishlistcontroller.findOne({ user_id : userid}).populate('Wishlistdata.productId').lean().then((list)=>{
                   if(list){
                    if(list.Wishlistdata.length >0){
                        response.wishlistempty = false;
                        response.list = list
                        resolve(response)
                    }else{
                        response.wishlistempty = true
                        response.list = list
                        resolve(response)
                    }
                   }else{
                    response.wishlistempty = true
                    resolve(response)
                   }
            })
        })
    }catch(error){
        reject(error)
    }
    },
    
    deleteItems : (productid,id,cb) => {
        wishlistcontroller.updateOne({user_id : id},{$pull:{Wishlistdata:{productId : productid}}},(err,taskData)=>{  
            if(err){  
                cb(err,null);  
            }else{  
                cb(null,taskData);  
            }  
    });
    }



}
