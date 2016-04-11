var constants = require('../constants');

/**
 * Create error object
 */
module.exports.createError = function(error) {
	var err = new Error();
	err.error = error;
	err.message = constants.MESSAGE_ERR;
	return err;
};

/**
 * Create error string
 */
module.exports.createErrorStr = function(message) {
	var err = new Error();
	err.error = constants.ERROR;
	err.message = message;
	return JSON.stringify(err);
};
