'use strict';

var myUtils 		= require('../../utility/utils');
var dbConfig		= require('../../config/dbConfig');
var constants 		= require('../../constants');
var braintreeConfig	= require('../../config/braintreeConfig');
module.exports ={
	getToken: getToken
}
function getToken(req, res) {
	braintreeConfig.clientToken.generate({}, function (err, response) {
  		if(err){
  			res.json(myUtils.createErrorStr("Have problem with payment system! Please try it later.", constants.ERROR_CODE));
  		}else{
  			res.json({returnCode: constants.SUCCESS_CODE, message : "Get toke success.", data: {token_payment: response.clientToken}});
  		}
  	});
}