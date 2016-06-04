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
	var query_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
					  	" WHERE " + constants.ID + " = ? ";
	dbConfig.query(query_call, [transactionObject.id], function(err, rows){
		if(err){
			res.json(myUtils.createDatabaseError(err));
		}else if(rows && rows.length > 0){
			var amount = rows[0].total + parseInt(transactionObject.tip);
			braintreeConfig.transaction.sale({
			  customerId: rows[0].user_id,
			  amount: amount
			}, function (err, result) {
				if(err){
					res.json(myUtils.createErrorStr("Have problem with payment system! Please try it later. " + err, constants.ERROR_CODE));
				}else if(result.success){
					transactionObject.currency = result.transaction.currencyIsoCode;
					transactionObject.amount   = result.transaction.amount;
					transactionObject.user 	   = rows[0].user_id;
					res.json({returnCode: constants.SUCCESS_CODE, message : "Checkout success!.", data: {transaction: transactionObject}});
				}else{
					res.json(myUtils.createErrorStr("Have problem with payment system! Please try it later. " + result.message, constants.ERROR_CODE));
				}
			});
			
		}else{
			res.json(myUtils.createErrorStr("Id does not exist. Please check again.", constants.ERROR_CODE));
		}
	});				  
};
