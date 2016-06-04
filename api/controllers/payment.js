'use strict';

var myUtils 		= require('../../utility/utils');
var dbConfig		= require('../../config/dbConfig');
var constants 		= require('../../constants');
var braintreeConfig	= require('../../config/braintreeConfig');
module.exports ={
	getToken: getToken,
	createTransaction: createTransaction
};
function getToken(req, res) {
	braintreeConfig.clientToken.generate({}, function (err, response) {
  		if(err){
  			res.json(myUtils.createErrorStr("Have problem with payment system! Please try it later. " + err, constants.ERROR_CODE));
  		}else{

  			res.json({returnCode: constants.SUCCESS_CODE, message : "Get toke success.", data: {token_payment: response.clientToken}});
  		}
  	});
};

function createTransaction (req, res){
	var transactionObject =  req.swagger.params.transaction.value;
	braintreeConfig.transaction.sale({
	  customerId: transactionObject.user_id,
	  amount: transactionObject.amount
	}, function (err, result) {
		if(err){
			res.json(myUtils.createErrorStr("Have problem with payment system! Please try it later. " + err, constants.ERROR_CODE));
		}else if(result.success){
			transactionObject.currency = result.transaction.currencyIsoCode;
			res.json({returnCode: constants.SUCCESS_CODE, message : "Checkout success!.", data: {transaction: transactionObject}});
		}else{
			res.json(myUtils.createErrorStr("Have problem with payment system! Please try it later. " + result.message, constants.ERROR_CODE));
		}
	});
};
