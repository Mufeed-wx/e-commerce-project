const mongoose = require('mongoose');
const adduser = require('../models/user-model');
const sessions = require('express-session');
const Promise = require('promise');
const bcrypt = require('bcrypt');
const { resolve, reject } = require('promise');
const usermodel = require('../models/user-model')

module.exports = {
  usersignup: (userdata) => {
    return new Promise(async (resolve, reject) => {
      console.log('NUMBER1', userdata);
      let user = await adduser.findOne({
        Mobile_Number: userdata.Mobile_Number,
      });
      const state = {
        exist: false,
        user: null,
      };
      if (user) {
        state.exist = true;
        resolve(state);
        console.log('number exist');
      } else {
        console.log('NUMBER3');
        let user = await adduser.findOne({ User_Email: userdata.User_Email });
        if (user) {
          state.exist = true;
          resolve(state);
          console.log('number exist3');
        } else {
          console.log('NUMBER4');
          userdata.Password = await bcrypt.hash(userdata.Password, 10);
          adduser.create(userdata).then(async (data) => {
            state.exist = false;
            state.user = userdata;
            resolve(state);
            console.log('always true');
          });
        }
      }

      });
  },

  userlogin: (logindata) => {
    return new Promise(async (resolve, reject) => {
      let response = {
        status: false,
        usernotfound: false,
      };
      console.log(logindata);

      let user = await adduser.findOne({ User_Email: logindata.User_Email });
      if (user) {
        console.log('valid email');
        bcrypt.compare(logindata.Password, user.Password, (err, valid) => {
          if (valid) {
            response.status = true;
            response.user = user;

            resolve(response);
            console.log('success b');
          } else {
            resolve(response);
            console.log(err);
          }
        });
      } else {
        response.usernotfound = true;
        resolve(response);
      }
    });
  },
  getUserData :(id,cb) => {
     usermodel.findById({_id: id},(err,data) =>{
      console.log(data);
      cb(null,data); 
    }) 
  }
};
