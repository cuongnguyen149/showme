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
  var userObject  = req.swagger.params.user.value;
  var email       = userObject.email,
      pwd         = userObject.pwd,
      firstname   = userObject.firstname,
      lastname    = userObject.lastname,
      dob         = userObject.dob,
      device_uiid = userObject.device_uiid; 
  pwd = pwd + constants.PWD_ADD;
  var params = {email : email, password: pwd};
  var query_email = "SELECT " + constants.EMAIL + 
                    " FROM " + constants.CLIENT_USER +
                    " WHERE "  + constants.EMAIL + " = ?"; 
  dbConfig.query(query_email, [userObject.email], function(err, rows){
    if(rows){
      if(rows.length > 0){
        res.json(myUtils.createErrorStr('Email already exist.', constants.ERROR_CODE));
      }else{
        quickbloxConfig.createSession(function(err, result) {
          if(result){
            quickbloxConfig.users.create(params, function(err, result) {
              // console.log(result);
              if(result){
                var userStr = '{"' + constants.USER_ID + '":"' + result.id + '", "'
                                   + constants.EMAIL + '":"' + email + '", "'
                                   + constants.PWD + '":"' + pwd + '", "'
                                   + constants.FIRSTNAME + '":"' + firstname + '", "' 
                                   + constants.LASTNAME + '":"' + lastname + '", "' 
                                   + constants.DOB + '":"' + dob + '", "' 
                                   + constants.DEVICE_UIID + '":"' + device_uiid + '"}'; 
                var userObj =  JSON.parse(userStr);
                var insert = "INSERT INTO " + constants.CLIENT_USER + " SET ?"; 
                dbConfig.query(insert, userObj, function(err, rows){
                   if(err){
                    // console.log(err);
                    res.json(myUtils.createDatabaseError(err)); 
                   }else{
                    var query_user = "SELECT * , DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB + 
                                     " FROM " + constants.CLIENT_USER +
                                     " WHERE "  + constants.USER_ID + " = ?";
                    dbConfig.query(query_user, [result.id], function(err, rows){
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
      // console.log(err);
      res.json(myUtils.createDatabaseError(err)); 
    }
  });                  
  
};
/**
* User login API (Integrate with QuickBlox)
*/
function login(req, res){
  var userObject = req.swagger.params.login.value;
      userObject.pwd = userObject.pwd + constants.PWD_ADD;
  var query = "SELECT *, DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.EMAIL + " = ?" +
              " AND " + constants.PWD + " = ?";
  var update = "UPDATE " + constants.CLIENT_USER +
               " SET " + constants.DEVICE_UIID + " = '" + userObject.device_uiid + "'" +
               " WHERE " + constants.EMAIL + " = ?";
               console.log(query);
  dbConfig.query(update, [userObject.email], function(err, rows){
    if(rows){
      dbConfig.query(query, [userObject.email, userObject.pwd], function(err, rows){
       if(err){
        console.log(err);
        res.json(myUtils.createDatabaseError(err)); 
       }else if(rows && rows.length > 0){
        res.json({returnCode : constants.SUCCESS_CODE, message: "Login successfully", data: myUtils.generateToken(rows[0])});  
       }else{
        res.json(myUtils.createErrorStr('Your email or password incorrect! Please check again!', constants.ERROR_CODE));
       } 
      });
    }else{
      console.log(err);
      res.json(myUtils.createDatabaseError(err));
    }
  });              
};
/**
* User update user's role API.
*/
function updateRole (req, res){
  var userObject = req.swagger.params.user.value;
  var role = "user";
  var user_id = userObject.user_id;
  var query = "SELECT *, NULL AS " + constants.PWD + ", NULL AS " + constants.FEE_PER_HOUR + ", NULL AS " + constants.MONTH_INCOME + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = ?";             
  if(userObject.role && userObject.role == "user"){
    role = "leader";
    query = "SELECT *, NULL AS " + constants.PWD + 
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = ?";
  }
  var update = "UPDATE " + constants.CLIENT_USER +
               " SET " + constants.ROLE + " = ?" + 
               " WHERE " + constants.USER_ID + " = ?";
               
  dbConfig.query(update, [role, user_id], function(err, rows){
    if(rows && rows.affectedRows != 0){
      dbConfig.query(query, [user_id], function(err, rows){
        if(rows){
          res.json({returnCode: constants.SUCCESS_CODE, message: "Updated user " + user_id + " to " + role + " role.", data : {user :rows[0]}});
        }else{
          res.json(myUtils.createDatabaseError(err));    
        }
      });
    }else if(err){
      res.json(myUtils.createDatabaseError(err));
    }else{
      res.json(myUtils.createErrorStr('Your params incorrect! Please check again!', constants.ERROR_CODE));
    }
  });             
};
/**
* User update user's profiles API.
*/
function updateUserProfiles(req, res){
  var userObject = req.swagger.params.user.value;

  var query_email = "SELECT " + constants.EMAIL + ", " + constants.PWD +
                  " FROM " + constants.CLIENT_USER +
                  " WHERE "  + constants.USER_ID + " = ?";

  var query_user = "SELECT * " +
                  " FROM " + constants.CLIENT_USER +
                  " WHERE "  + constants.USER_ID + " = ?";

  var update_user = "UPDATE " + constants.CLIENT_USER +
                    " SET " + constants.AVATAR + " = ?, " +
                              constants.FIRSTNAME + " = ?, " + 
                              constants.LASTNAME + " = ?, " + 
                              constants.LANGUAGE + " = ?, " + 
                              constants.DESCRIPTION + " = ?, " + 
                              constants.FEE_PER_HOUR + " = ?, " + 
                              constants.POSSIBLE_PURCHASE + " = ?, " + 
                              constants.SEX + " = ?, " + 
                              constants.DOB + " = ?, " + 
                              constants.EMAIL + " = ?, " + 
                              constants.ADDRESS + " = ?, " + 
                              constants.PHONE + " = ? " + 
                    " WHERE " + constants.USER_ID + " = ? ";                                  
  dbConfig.query(query_email, [userObject.user_id], function(err, rows){
    if(rows && rows.length > 0 && rows[0].email == userObject.email){
      res.json(myUtils.createErrorStr('Email already exist.', constants.ERROR_CODE));
    }else if(err){
      res.json(myUtils.createDatabaseError(err));
    }else{
      console.log(rows[0]);
      var params = {email: rows[0].email, password : rows[0].pwd};
      quickbloxConfig.createSession(params, function(err, result) {
        if(result){
          quickbloxConfig.users.update(userObject.user_id, {email : userObject.email}, function(err, result){
            if(result){
              dbConfig.query(update_user,[userObject.avatar, userObject.firstname, userObject.lastname, 
                                          userObject.language, userObject.description, userObject.fee_per_hour,
                                          userObject.possible_purchase, userObject.sex, userObject.dob, 
                                          userObject.email, userObject.address, userObject.phone, userObject.user_id] ,function(err, rows){
                 if(rows){
                    dbConfig.query(query_user, [userObject.user_id], function(err, rows){
                      if(rows && rows.length > 0){
                        res.json({returnCode: constants.SUCCESS_CODE, message: "Updated user " + userObject.user_id + " successfully.", data : {user :rows[0]}});
                      }else if(err){
                        console.log(err);
                        res.json(myUtils.createDatabaseError(err));
                      }else{
                        res.json(myUtils.createErrorStr('user_id incorrect! Please check again.', constants.ERROR_CODE));
                      }
                    });
                 }else{
                  console.log(err);
                  res.json(myUtils.createDatabaseError(err));
                 } 
              });
            }else{
              res.json(myUtils.createQuickBloxError(err));
            }
          }); 
        }else{
          console.log(err);
          res.json(myUtils.createQuickBloxError(err));
        }
      });      
    }
  });                  
};