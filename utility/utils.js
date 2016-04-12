var constants = require('../constants');
var jwt = require('jwt-simple');

/**
 * Create error object.
 */
module.exports.createError = function(error) {
	var err = new Error();
	err.error = error;
	err.message = constants.MESSAGE_ERR;
	return err;
};

/**
 * Create error string.
 */
module.exports.createErrorStr = function(message) {
	var err = new Error();
	err.error = constants.ERROR;
	err.message = message;
	return JSON.stringify(err);
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
          "codeResponse": 1000,
          "message": "Token Expired"
        });
        return;
      }else{
        next();
      }
    }catch(err){
      res.json({
      "codeResponse": 1002,
      "message": "Opps!! Something went wrong!",
      "error" : err
    });
    }  
  } else {
    res.json({
      "codeResponse": 1001,
      "message": "Invalid Token"
    });
    return;
  }
};

