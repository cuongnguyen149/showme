var constants = require('../constants');
var jwt       = require('jwt-simple');
var _         = require('underscore');
var config    = require('./appConfig');
var gcm       = require('node-gcm');
var sender    = new gcm.Sender(config.googleCloudMessage.api_key);
var pushNotificationMessage   = new gcm.Message();
/**
 * Create Quickblox error object.
 */
module.exports.createQuickBloxError = function(error) {
	var err = new Error();
	err.data = error;
  err.returnCode = constants.QUICKBLOX_ERROR_CODE;
	err.message = constants.MESSAGE_QUICKBLOX_ERR;
	return err;
};
/**
 * Create Quickblox error object.
 */
module.exports.createDatabaseError = function(error) {
  var err = new Error();
  err.data = error;
  err.returnCode = constants.DATABASE_ERROR_CODE;
  err.message = constants.MESSAGE_DATABASE_ERR;
  return err;
};

/**
 * Create error string.
 */
module.exports.createErrorStr = function(message, returnCode) {
	var err = new Error();
	err.data = {error : constants.ERROR};
	err.message = message;
  err.returnCode = returnCode;
	return err;
};

/**
 * Generate token for user.
 */
module.exports.generateToken = function() {
  var expires = expiresIn(2);
  var token = jwt.encode({
    exp: expires
  }, 'showme-serect-string');
  return token;
};

/**
 * Set expire date for token.
 */
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
};

module.exports.validateToken = function(req, res, next) {
  var token = req.headers['token'];
  if (token) {
    try{
      var decoded = jwt.decode(token, 'showme-serect-string');
      if (decoded.exp <= Date.now()) {
        res.json( {
          "returnCode": constants.TOKEN_EXPIRE_CODE,
          "message": "Token Expired",
          "data" : {}
        });
        return;
      }else{
        next();
      }
    }catch(err){
      res.json({
      "returnCode": constants.TOKEN_ERROR_CODE,
      "message": "Opps!! Something went wrong!",
      "data" : err
    });
    }  
  } else {
    res.json({
      "returnCode": constants.TOKEN_ERROR_CODE,
      "message": "Invalid Token",
      "data": {}
    });
    return;
  }
};

/**
 * Merge 2 arrays of objects by properties using underscore.js
 */

module.exports.mergeByProperty = function(arr1, arr2, prop1, prop2) {
  _.each(arr2, function(arr2obj) {
    var arr1obj = _.find(arr1, function(arr1obj) {
        return arr1obj[prop1] === arr2obj[prop2];
    });
     
    //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
    if(arr1obj){
      _.extend(arr1obj, arr2obj);
      delete arr1obj.pwd;
    } 
  });
}; 
/**
 * Random string.
 */

module.exports.ramdomString = function (length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}; 

/**
 * Send push notification for android with message and title
 */

module.exports.sendPushNotificationAndroid = function (message, deviceId, user_id){
  var registrationIds = [];
  registrationIds.push(deviceId);
  pushNotificationMessage.addData('message', message);
  pushNotificationMessage.addData('user_id', user_id);
  pushNotificationMessage.delayWhileIdle = true;
  pushNotificationMessage.addNotification('title', 'certification');
  sender.send(pushNotificationMessage, registrationIds, 5, function(err, result) {
    if(err){
      console.error(err);
      return false;
    }else{
      console.log(result); 
      return true;
    }
  });    
}; 
