'use strict';
// var util = require('util');
var config = require('../../config/appConfig');
var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
module.exports = {
  registerUser: registerUser,
  login : login,
  updateRole: updateRole
};
/**
* Register API (Integrate with QuickBlox)
*/
function registerUser(req, res) {
  var userObject = req.swagger.params.user.value;
  var params = {email : userObject.email, password: userObject.pwd};
  quickbloxConfig.createSession(function(err, result) {
    if(result){
      quickbloxConfig.users.create(params, function(err, result) {
        // console.log(result);
        if(result){
          var insert = "INSERT INTO " + constants.CLIENT_USER +  
                      " (" + constants.USER_ID + ", " + constants.EMAIL + ", " + constants.PWD + ", " + constants.FIRSTNAME + ", " + constants.LASTNAME + ", " + constants.DOB + ", " + constants.DEVICE_UIID + ") " +
                      "VALUES " +
                      "( "+ result.id + ", '"+ userObject.email + "', '"+ userObject.pwd + "', '" + userObject.firstname + "', '" + userObject.lastname + "', '" + userObject.dob + "', '" + userObject.device_uiid + "');";
          dbConfig.query(insert, function(err, rows){
             if(err){
              // console.log(err);
              res.json(myUtils.createError(err)); 
             }else{
              var query = "SELECT *, NULL AS " + constants.PWD + 
                          " FROM " + constants.CLIENT_USER +
                          " WHERE "  + constants.USER_ID + " = "  + result.id;
              dbConfig.query(query, function(err, rows){
               if(err){
                // console.log(err);
                res.json(myUtils.createError(err)); 
               }else{
                // console.log(rows[0]);
                res.status(201).json(myUtils.generateToken(rows[0]));  
               } 
              });
             } 
          });              
        }else{
          res.json(myUtils.createError(err)); 
        }
      });  
    }else{
      res.json(myUtils.createError(err));
    }    
  });
};
/**
* User login API (Integrate with QuickBlox)
*/
function login(req, res){
  var userObject = req.swagger.params.login.value;
  var params = {email : userObject.email, password: userObject.pwd};
  quickbloxConfig.createSession(function(err, result) {
    if(result){
      quickbloxConfig.login(params, function(err, result) {
        if(result){
          // console.log("login success!!!!");
          var query = "SELECT *, NULL AS " + constants.PWD + 
                      " FROM " + constants.CLIENT_USER +
                      " WHERE "  + constants.USER_ID + " = "  + result.id;
          var update = "UPDATE " + constants.CLIENT_USER +
                       " SET " + constants.DEVICE_UIID + " = " + userObject.device_uiid +
                       " WHERE " + constants.USER_ID + " = "  + result.id;
          dbConfig.query(update, function(err, rows){
            if(rows){
              dbConfig.query(query, function(err, rows){
               if(err){
                // console.log(err);
                res.json(myUtils.createError(err)); 
               }else{
                // console.log(myUtils.generateToken(rows[0]));
                res.json(myUtils.generateToken(rows[0]));  
               } 
              });
            }else{
              res.json(myUtils.createError(err));
            }
          });             
        }else{
          res.json(myUtils.createError(err));
        }
      });
    }else{
      res.json(myUtils.createError(err));
    }
  });    
};

function updateRole (req, res){
  var userObject = req.swagger.params.user.value;
  var role = "user";
  if(userObject.role && userObject.role == "user"){
    role = "leader";
  }
  var update = "UPDATE " + constants.CLIENT_USER +
               " SET " + constants.ROLE + " = '" + role  + "' " +
               " WHERE " + constants.USER_ID + " = "  + userObject.user_id;
  dbConfig.query(update, function(err, rows){
    if(rows){
      res.status(200).json({message: "Updated user " + userObject.user_id + " to " + role + " role."});
    }else{
      res.json(myUtils.createError(err));
    }
  });             
}