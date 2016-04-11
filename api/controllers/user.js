'use strict';
// var util = require('util');
var config = require('../../config/appConfig');
var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
module.exports = {
  registerUser: registerUser
};

function registerUser(req, res) {
  var userObject = req.swagger.params.user.value;
  var params = {email : userObject.email, password: userObject.pwd};
  quickbloxConfig.createSession(function(err, result) {
    if(err){
      res.json(myUtils.createError(err));
    }else{
      quickbloxConfig.users.create(params, function(err, result) {
        // console.log(result);
        if(err){
          res.json(myUtils.createError(err)); 
        }else{
          if(result){
            var query = "INSERT INTO " + constants.CLIENT_USER +  
                        " (" + constants.USER_ID + ", " + constants.EMAIL + ", " + constants.PWD + ", " + constants.FIRSTNAME + ", " + constants.LASTNAME + ", " + constants.DOB + ", " + constants.DEVICE_UIID + ") " +
                        "VALUES " +
                        "( "+ result.id + ", '"+ userObject.email + "', '"+ userObject.pwd + "', '" + userObject.firstname + "', '" + userObject.lastname + "', '" + userObject.dob + "', '" + userObject.device_uiid + "');";
            dbConfig.query(query, function(err, rows){
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
                  console.log(rows);  
                 } 
                }); 
                // res.json({message: "success"});
               } 
            });              
          }else{

          }
        }
      });  
    }    
  });
}
