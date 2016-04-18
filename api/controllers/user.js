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
  updateRole: updateRole,
  updateUserProfiles : updateUserProfiles
};
/**
* Register API (Integrate with QuickBlox)
*/
function registerUser(req, res) {
  var userObject = req.swagger.params.user.value;
  var params = {email : userObject.email, password: userObject.pwd};
  var query_email = "SELECT " + constants.EMAIL + 
                    " FROM " + constants.CLIENT_USER +
                    " WHERE "  + constants.EMAIL + " = '"  + userObject.email + "'";
  dbConfig.query(query_email, function(err, rows){
    if(rows){
      if(rows.length > 0){
        res.json(myUtils.createErrorStr('Email already exist.', constants.ERROR_CODE));
      }else{
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
                    res.json(myUtils.createDatabaseError(err)); 
                   }else{
                    var query = "SELECT *, NULL AS " + constants.PWD + 
                                " FROM " + constants.CLIENT_USER +
                                " WHERE "  + constants.USER_ID + " = "  + result.id;
                    dbConfig.query(query, function(err, rows){
                     if(err){
                      // console.log(err);
                      res.json(myUtils.createDatabaseError(err)); 
                     }else{
                      // console.log(rows[0]);
                      res.status(201).json({returnCode : constants.SUCCESS_CODE, message: "Sign up successfully", data: myUtils.generateToken(rows[0])});  
                     } 
                    });
                   } 
                });              
              }else{
                res.json(myUtils.createQuickBloxError(err)); 
              }
            });  
          }else{
            res.json(myUtils.createQuickBloxError(err));
          }    
        });
      }
    }else{
      res.json(myUtils.createDatabaseError(err)); 
    }
  });                  
  
};
/**
* User login API (Integrate with QuickBlox)
*/
function login(req, res){
  console.log(req.swagger.params);
  // var userObject = req.swagger.params.login.value;
  // var params = {email : userObject.email, password: userObject.pwd};
  // quickbloxConfig.createSession(function(err, result) {
  //   if(result){
  //     quickbloxConfig.login(params, function(err, result) {
  //       if(result){
  //         // console.log("login success!!!!");
  //         var query = "SELECT *, NULL AS " + constants.PWD + 
  //                     " FROM " + constants.CLIENT_USER +
  //                     " WHERE "  + constants.USER_ID + " = "  + result.id;
  //         var update = "UPDATE " + constants.CLIENT_USER +
  //                      " SET " + constants.DEVICE_UIID + " = '" + userObject.device_uiid + "'" +
  //                      " WHERE " + constants.USER_ID + " = "  + result.id;
  //         dbConfig.query(update, function(err, rows){
  //           if(rows){
  //             dbConfig.query(query, function(err, rows){
  //              if(err){
  //               console.log(err);
  //               res.json(myUtils.createDatabaseError(err)); 
  //              }else{
  //               // console.log(myUtils.generateToken(rows[0]));
  //               res.json({returnCode : constants.SUCCESS_CODE, message: "Login successfully", data: myUtils.generateToken(rows[0])});  
  //              } 
  //             });
  //           }else{
  //             console.log(err);
  //             res.json(myUtils.createDatabaseError(err));
  //           }
  //         });             
  //       }else{
  //         res.json(myUtils.createErrorStr('Login fail. Incorrect Email or Password. Please try again.', constants.ERROR_CODE));
  //       }
  //     });
  //   }else{
  //     res.json(myUtils.createQuickBloxError(err)); 
  //   }
  // });    
};
/**
* User update user's role API.
*/
function updateRole (req, res){
  var userObject = req.swagger.params.user.value;
  var role = "user";
  var query = "SELECT *, NULL AS " + constants.PWD + ", NULL AS " + constants.FEE_PER_HOUR + ", NULL AS " + constants.MONTH_INCOME +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = "  + userObject.user_id;
  var update = "UPDATE " + constants.CLIENT_USER +
               " SET " + constants.ROLE + " = '" + role  + "' " +
               " WHERE " + constants.USER_ID + " = "  + userObject.user_id;             
  if(userObject.role && userObject.role == "user"){
    role = "leader";
    query = "SELECT *, NULL AS " + constants.PWD + 
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = "  + userObject.user_id;
  }
  dbConfig.query(update, function(err, rows){
    if(rows){
      dbConfig.query(query, function(err, rows){
        if(rows){
          res.json({returnCode: constants.SUCCESS_CODE, message: "Updated user " + userObject.user_id + " to " + role + " role.", data : {user :rows[0]}});
        }else{
          res.json(myUtils.createDatabaseError(err));    
        }
      });
    }else{
      res.json(myUtils.createDatabaseError(err));
    }
  });             
};
/**
* User update user's profiles API.
*/
function updateUserProfiles(req, res){
  var userObject = req.swagger.params.user.value,
      user_id    = userObject.user_id,
      email       = userObject.email;

  var query_email = "SELECT " + constants.EMAIL + 
                    " FROM " + constants.CLIENT_USER +
                    " WHERE "  + constants.EMAIL + " = '"  + email + "'";
  dbConfig.query(query_email, function(err, rows){
    if(rows){
      if(rows.length > 0 && row[0].email != userObject.email){
        res.json(myUtils.createErrorStr('Email already exist.', constants.ERROR_CODE));
      }else{
        quickbloxConfig.createSession(function(err, result) {
          if(result){
            quickbloxConfig.users.update(user_id, {email: email}, function(err, result){
              if(result){
                console.log(result);
              }else{
                console.log(err);
              }
            }); 
          }else{
            console.log(err);
          }
        });
      }
    }else{
      console.log(err);
    }
  });                  
};