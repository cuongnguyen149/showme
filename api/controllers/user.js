'use strict';
// var util = require('util');
var config = require('../../config/appConfig');
var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
var nodemailer = require('nodemailer');
var braintreeConfig = require('../../config/braintreeConfig');
module.exports = {
  registerUser: registerUser,
  login : login,
  updateRole: updateRole,
  updateUserProfiles : updateUserProfiles,
  forgotPassword: forgotPassword,
  createCardInfo : createCardInfo,
  getUserPaymentInfo: getUserPaymentInfo,
  getUserInfoByToken: getUserInfoByToken 
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
      device_uiid = userObject.device_uiid,
      token       = myUtils.generateToken(); 
  pwd = pwd + constants.PWD_ADD;
  var params = {email : email, password: pwd, full_name: lastname + ' ' + firstname};
  var query_email = "SELECT " + constants.EMAIL + 
                    " FROM " + constants.CLIENT_USER +
                    " WHERE "  + constants.EMAIL + " = ?"; 
  dbConfig.query(query_email, [userObject.email], function(err, rows){
    if(rows){
      if(rows.length > 0){
        res.json(myUtils.createErrorStr("L'email existe déjà.", constants.ERROR_CODE));
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
                                   + constants.TOKEN + '":"' + token + '", "' 
                                   + constants.DEVICE_UIID + '":"' + device_uiid + '"}'; 
                var userObj =  JSON.parse(userStr);
                var insert = "INSERT INTO " + constants.CLIENT_USER + " SET ?"; 
                dbConfig.query(insert, userObj, function(err, rows){
                   if(err){
                    // console.log(err);
                    res.json(myUtils.createDatabaseError(err)); 
                   }else{
                    var query_user = "SELECT * , DATE_FORMAT( " + constants.DOB + ", '%d/%m/%Y') AS "+  constants.DOB
                                                + ", DATE_FORMAT( " + constants.CREATE_DATE + ", '%d/%m/%Y') AS "+  constants.CREATE_DATE               
                                                + ", DATE_FORMAT( " + constants.UPDATE_DATE + ", '%d/%m/%Y') AS "+  constants.UPDATE_DATE + 
                                     " FROM " + constants.CLIENT_USER +
                                     " WHERE "  + constants.USER_ID + " = ?";
                    dbConfig.query(query_user, [result.id], function(err, rows){
                     if(err){
                      // console.log(err);
                      res.json(myUtils.createDatabaseError(err)); 
                     }else{
                      // console.log(rows[0]);
                      res.status(201).json({returnCode : constants.SUCCESS_CODE, message: "Sign up successfully", data: rows[0]});  
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
  var userObject = req.swagger.params.login.value,
      token      = myUtils.generateToken(); 
      userObject.pwd = userObject.pwd + constants.PWD_ADD;
  var query = "SELECT *, DATE_FORMAT( " + constants.DOB + ", '%d/%m/%Y') AS "+  constants.DOB
                        + ", DATE_FORMAT( " + constants.CREATE_DATE + ", '%d/%m/%Y') AS "+  constants.CREATE_DATE               
                        + ", DATE_FORMAT( " + constants.UPDATE_DATE + ", '%d/%m/%Y') AS "+  constants.UPDATE_DATE +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.EMAIL + " = ?" +
              " AND " + constants.PWD + " = ?";
  var update = "UPDATE "  + constants.CLIENT_USER +
               " SET "    + constants.DEVICE_UIID + " = ?, "
                          + constants.TOKEN + " = ? " + 
               " WHERE "  + constants.EMAIL + " = ?";
  dbConfig.query(update, [userObject.device_uiid, token, userObject.email], function(err, rows){
    if(rows){
      dbConfig.query(query, [userObject.email, userObject.pwd], function(err, rows){
       if(err){
        console.log(err);
        res.json(myUtils.createDatabaseError(err)); 
       }else if(rows && rows.length > 0){
        res.json({returnCode : constants.SUCCESS_CODE, message: "Connectez-vous avec succès", data: rows[0]});  
       }else{
        res.json(myUtils.createErrorStr("Votre e-mail ou mot de passe incorrect! S'il vous plaît le vérifier!", constants.ERROR_CODE));
       } 
      });
    }else{
      console.log(err);
      res.json(myUtils.createDatabaseError(err));
    }
  });              
};
/**
* get user info by token API.
*/
function getUserInfoByToken (req, res){
  var token = req.swagger.params.token.value;
  var query = "SELECT *, DATE_FORMAT( " + constants.DOB + ", '%d/%m/%Y') AS "+  constants.DOB
                        + ", DATE_FORMAT( " + constants.CREATE_DATE + ", '%d/%m/%Y') AS "+  constants.CREATE_DATE               
                        + ", DATE_FORMAT( " + constants.UPDATE_DATE + ", '%d/%m/%Y') AS "+  constants.UPDATE_DATE +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.TOKEN + " = ?"
  dbConfig.query(query, [token], function(err, rows){
   if(err){
    console.log(err);
    res.json(myUtils.createDatabaseError(err)); 
   }else if(rows && rows.length > 0){
    res.json({returnCode : constants.SUCCESS_CODE, message: "Get user info by token success", data: rows[0]});  
   }else{
    res.json(myUtils.createErrorStr("Cannot find user info with token: " + token , constants.ERROR_CODE));
   } 
  });            
}
/**
* User update user's role API.
*/
function updateRole (req, res){
  var userObject = req.swagger.params.user.value;
  var role = "user";
  var user_id = userObject.user_id;
  var query = "SELECT *, NULL AS " + constants.PWD + ", NULL AS " + constants.FEE_PER_HOUR + ", NULL AS " + constants.MONTH_INCOME + ", DATE_FORMAT( " + constants.DOB + ", '%d/%m/%Y') AS "+  constants.DOB
                  + ", DATE_FORMAT( " + constants.CREATE_DATE + ", '%d/%m/%Y') AS "+  constants.CREATE_DATE               
                  + ", DATE_FORMAT( " + constants.UPDATE_DATE + ", '%d/%m/%Y') AS "+  constants.UPDATE_DATE +
              " FROM " + constants.CLIENT_USER +
              " WHERE "  + constants.USER_ID + " = ?";             
  if(userObject.role && userObject.role == "user"){
    role = "leader";
    query = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%d/%m/%Y') AS "+  constants.DOB
                                                 + ", DATE_FORMAT( " + constants.CREATE_DATE + ", '%d/%m/%Y') AS "+  constants.CREATE_DATE              
                                                 + ", DATE_FORMAT( " + constants.UPDATE_DATE + ", '%d/%m/%Y') AS "+  constants.UPDATE_DATE + 
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
      res.json(myUtils.createErrorStr("Votre params incorrecte! S'il vous plaît le vérifier.!", constants.ERROR_CODE));
    }
  });             
};
/**
* User update user's profiles API.
*/
function updateUserProfiles(req, res){
  var userObject = req.swagger.params.user.value;
  var avatarUrl = req.protocol + '://' + req.get('host') + "/showme/v1/image/user/avatar/avatar_" + userObject.user_id +".jpg";  
  
  var query_email       = "SELECT " + constants.EMAIL + ", " + constants.PWD + ", " + constants.AVATAR +
                          " FROM " + constants.CLIENT_USER +
                          " WHERE "  + constants.USER_ID + " = ?";
  var query_existEmail  = "SELECT " + constants.EMAIL + ", " + constants.PWD +
                          " FROM " + constants.CLIENT_USER +
                          " WHERE "  + constants.USER_ID + " != ?";                
  var query_user        = "SELECT *, DATE_FORMAT( " + constants.DOB + ", '%d/%m/%Y') AS "+  constants.DOB
                                    + ", DATE_FORMAT( " + constants.CREATE_DATE + ", '%d/%m/%Y') AS "+  constants.CREATE_DATE              
                                    + ", DATE_FORMAT( " + constants.UPDATE_DATE + ", '%d/%m/%Y') AS "+  constants.UPDATE_DATE + 
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
  dbConfig.query(query_existEmail, [userObject.user_id], function(err, rows){
    if(rows && rows.length > 0 && rows[0].email == userObject.email){
      res.json(myUtils.createErrorStr("L'email existe déjà.", constants.ERROR_CODE));
    }else if(err){
      res.json(myUtils.createDatabaseError(err));
    }else{
      dbConfig.query(query_email, [userObject.user_id], function(err, rows){
        if(rows && rows.length > 0){
          var oldAvatar = rows[0].avatar;
          var params = {email: rows[0].email, password : rows[0].pwd};
          quickbloxConfig.createSession(params, function(err, result) {
            if(result){
              quickbloxConfig.users.update(userObject.user_id, {email : userObject.email}, function(err, result){
                if(result){
                  if(userObject.avatar && userObject.avatar.length > 10){
                    var base64Data = userObject.avatar.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
                    require("fs").writeFile("./public/showme/v1/image/user/avatar/avatar_" + userObject.user_id +".jpg", base64Data, 'base64', function(err) {
                      if(err){
                        res.json(myUtils.createDatabaseError(err));
                      }else{
                        dbConfig.query(update_user,[avatarUrl, userObject.firstname, userObject.lastname, 
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
                      }
                    });
                  }else{
                    dbConfig.query(update_user,[oldAvatar, userObject.firstname, userObject.lastname, 
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
                  }
                }else{
                  res.json(myUtils.createQuickBloxError(err));
                }
              }); 
            }else{
              console.log(err);
              res.json(myUtils.createQuickBloxError(err));
            }
          });      
        }else if(err){
          res.json(myUtils.createDatabaseError(err));
        }else{
        }
      });                        
    }
  });                                                    
};

/**
* User forger password API.
*/
function forgotPassword(req, res){
  var userObject  = req.swagger.params.user.value;
  var query_user  = "SELECT " + constants.EMAIL + ", " + constants.PWD + ", " + constants.USER_ID +
                      " FROM " + constants.CLIENT_USER +
                      " WHERE "  + constants.EMAIL + " = ?";
  var update_pwd  = "UPDATE " + constants.CLIENT_USER + 
                    " SET " + constants.PWD + " = ?" +
                    " WHERE " + constants.EMAIL + " = ? ";                
  dbConfig.query(query_user, [userObject.email], function(err, rows){
    if(err){
       res.json(myUtils.createDatabaseError(err));
    }else if(rows && rows.length > 0){
      var newPwd = myUtils.ramdomString(10);
      var newPwdWithAdd = newPwd + constants.PWD_ADD;
      console.log(newPwd);
      var params = {email: rows[0].email, password : rows[0].pwd};
          quickbloxConfig.createSession(params, function(err, result) {
            if(err){
               res.json(myUtils.createQuickBloxError(err));
            }else{
              quickbloxConfig.users.update(rows[0].user_id, {old_password: rows[0].pwd, password: newPwdWithAdd}, function(err, result){
                if(err){
                   res.json(myUtils.createQuickBloxError(err));
                }else{
                  dbConfig.query(update_pwd, [newPwdWithAdd, userObject.email], function(err, rows){
                    if(err){
                      res.json(myUtils.createDatabaseError(err));
                    }else{
                      var smtpTransport = nodemailer.createTransport('SMTP', {
                        service: 'Gmail',
                        auth: {
                           XOAuth2: {
                            user: "perboy9x@gmail.com",
                            clientId: "740381407173-hjmgu9jjlk8pb3fn2rvhufugu5noomdk.apps.googleusercontent.com",
                            clientSecret: "ldt_vqu09jz6nP1jvNSUnbbJ",
                            refreshToken: "1/86k_jcq984BrSsC-l1C88pbpklDg3IcNxXlcWlpF6kw"
                          }
                        }
                      });
                      var mailOptions = {
                        to: userObject.email,
                        from: 'passwordreset@gmail.com',
                        subject: '[Show me] Password Reset',
                        text: 'You are receiving this because you (or someone else) have reset the password for your account.\n\n' +
                          'Please use the new password below for login to Show Me application:\n\n' +
                          'Password: ' + newPwd, 
                      };
                      smtpTransport.sendMail(mailOptions, function(err) {
                        if(!err){
                          res.json({returnCode: constants.SUCCESS_CODE, message: "Nouveau mot de passe sera envoyé à " + userObject.email + ". S'il vous plaît vérifier votre boîte de réception!", data : {pwd: newPwd}});
                        }else{
                           res.json(myUtils.createErrorStr('Error with mail server. ' + err, constants.ERROR_CODE));
                        }
                      }); 
                    }
                  });
                }  
              });
            }
          });
    }else{
      res.json(myUtils.createErrorStr("Email n'existe pas! S'il vous plaît le vérifier.", constants.ERROR_CODE));
    }
  });                     
};
/**
* User create card info API.
*/ 
function createCardInfo (req, res){
  var cardObject  = req.swagger.params.card.value;
  var insert_card = "INSERT INTO " + constants.USER_CARD_INFORMATION + " SET ? ";
  var cardStr = '{"' + constants.USER_ID + '":"' + cardObject.user_id + '", "'
                     + constants.CARD_NUMBER + '":"' + cardObject.card_number + '", "'
                     + constants.EXPIRATION_DATE + '":"' + cardObject.expiration_date + '", "'
                     + constants.CVV + '":"' + cardObject.cvv + '"}';
  var cardObj =  JSON.parse(cardStr);
  braintreeConfig.customer.create({
      id: cardObject.user_id,  
      creditCard : {
        number : cardObject.card_number,
        cvv : cardObject.cvv,
        expirationDate : cardObject.expiration_date
      }
      }, function (err, result) {
          if(err){
             res.json(myUtils.createErrorStr("Avoir problème avec le système de paiement! S'il vous plaît essayer plus tard. " + err, constants.ERROR_CODE));
          }else if(result.success){

            dbConfig.query(insert_card, cardObj, function(err, rows){
              if(err){
                res.json(myUtils.createDatabaseError(err));
              }else{
                res.json({returnCode: constants.SUCCESS_CODE, message: "Créer carte avec succès.", data : {card: cardObject}});
              }
            });  
          }else{
            res.json(myUtils.createErrorStr("Avoir problème avec le système de paiement! S'il vous plaît essayer plus tard. " + result.message, constants.ERROR_CODE));
          }
        });
};

function getUserPaymentInfo (req, res){
  var user_id = req.swagger.params.user_id.value;
  var query   = "SELECT * FROM " + constants.USER_CARD_INFORMATION +
          " WHERE " + constants.USER_ID + " = ?";
  dbConfig.query(query, [user_id], function(err, rows){
    if(err){
      res.json(myUtils.createDatabaseError(err));
    }else if(rows && rows.length > 0){
      res.json({returnCode: constants.SUCCESS_CODE, message : "Get payment info success.", data:{ card : rows[0]}});
    }else{
      res.json(myUtils.createErrorStr("N'existe pas d'info de paiement de l'utilisateur" + user_id + ".", constants.ERROR_CODE));
    }
  })          
}
