var constants = require('../constants');
var jwt = require('jwt-simple');

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
module.exports.generateToken = function(user) {
  var expires = expiresIn(2);
  var token = jwt.encode({
    exp: expires
  }, 'showme-serect-string');

  return {
    token: token,
    user: user
  };
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

