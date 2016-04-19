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
  var email = req.swagger.params.email.value,
      pwd = req.swagger.params.pwd.value,
      firstname = req.swagger.params.firstname.value,
      lastname = req.swagger.params.lastname.value,
      dob = req.swagger.params.dob.originalValue,
      device_uiid = req.swagger.params.device_uiid.value;        
  var params = {email : email, password: pwd};
  var query_email = "SELECT " + constants.EMAIL + 
                    " FROM " + constants.CLIENT_USER +
                    " WHERE "  + constants.EMAIL + " = '"  + email + "'";
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
                            "( "+ result.id + ", '"+ email + "', '"+ pwd + "', '" + firstname + "', '" + lastname + "', '" + dob + "', '" + device_uiid + "');";
                dbConfig.query(insert, function(err, rows){
                   if(err){
                    res.json(myUtils.createDatabaseError(err)); 
                   }else{
                    var query = "SELECT *, NULL AS " + constants.PWD + 
                                " FROM " + constants.CLIENT_USER +
                                " WHERE "  + constants.USER_ID + " = "  + result.id;
                    dbConfig.query(query, function(err, rows){
                     if(err){
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
  var email = req.swagger.params.email.value,
      pwd = req.swagger.params.pwd.value,
      device_uiid = req.swagger.params.device_uiid.value; 
  var params = {email : email, password: pwd};
  quickbloxConfig.createSession(function(err, result) {
    if(result){
      quickbloxConfig.login(params, function(err, result) {
        if(result){
          // console.log("login success!!!!");
          var query = "SELECT *, NULL AS " + constants.PWD + 
                      " FROM " + constants.CLIENT_USER +
                      " WHERE "  + constants.USER_ID + " = "  + result.id;
          var update = "UPDATE " + constants.CLIENT_USER +
                       " SET " + constants.DEVICE_UIID + " = '" + device_uiid + "'" +
                       " WHERE " + constants.USER_ID + " = "  + result.id;
          dbConfig.query(update, function(err, rows){
            if(rows){
              dbConfig.query(query, function(err, rows){
               if(err){
                res.json(myUtils.createDatabaseError(err)); 
               }else{
                // console.log(myUtils.generateToken(rows[0]));
                res.json({returnCode : constants.SUCCESS_CODE, message: "Login successfully", data: myUtils.generateToken(rows[0])});  
               } 
              });
            }else{
              res.json(myUtils.createDatabaseError(err));
            }
          });             
        }else{
          res.json(myUtils.createErrorStr('Login fail. Incorrect Email or Password. Please try again.', constants.ERROR_CODE));
        }
      });
    }else{
      res.json(myUtils.createQuickBloxError(err)); 
    }
  });    
};
/**
* User update user's role API.
*/
function updateRole (req, res){
  var user_id = req.swagger.params.user_id.value,
      role = req.swagger.params.role.value;
  var role_update = "user";
  if(role && role == "user"){
    role_update = "leader";
    query = "SELECT *, NULL AS " + constants.PWD + 
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = "  + user_id;
  }
  var query = "SELECT *, NULL AS " + constants.PWD + ", NULL AS " + constants.FEE_PER_HOUR + ", NULL AS " + constants.MONTH_INCOME +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = "  + user_id;
  var update = "UPDATE " + constants.CLIENT_USER +
               " SET " + constants.ROLE + " = '" + role_update  + "' " +
               " WHERE " + constants.USER_ID + " = "  + user_id;             
  dbConfig.query(update, function(err, rows){
    if(rows){
      dbConfig.query(query, function(err, rows){
        if(rows){
          res.json({returnCode: constants.SUCCESS_CODE, message: "Updated user " + user_id + " to " + role_update + " role.", data : {user :rows[0]}});
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
      if(rows.length > 0 && rows[0].email != userObject.email){
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