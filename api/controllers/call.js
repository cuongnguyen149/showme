'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var constants = require('../../constants');
module.exports = {
	createCall: createCall,
	getPrice : getPrice
};
function createCall (req, res){
	var callObject 			= req.swagger.params.call.value;
	var user_id 			= callObject.user_id,
		leader_id 			= callObject.leader_id,
		dialog_id			= callObject.dialog_id;
	var callStr 		= '{"'  + constants.USER_ID + '":"' + user_id + '", "'
	                     		+ constants.LEADER_ID + '":"' + leader_id + '", "' 
	                     		+ constants.DIALOG_ID + '":"' + dialog_id + '"}'; 
    var callObj 		=  JSON.parse(callStr);	
	var insert_call 	= "INSERT INTO " + constants.TRANSACTION_PRICE + " SET ?",
		query_call 			= "SELECT * FROM " + constants.TRANSACTION_PRICE + " WHERE " + constants.ID + " = ?";
	dbConfig.query(insert_call, callObj, function(err, rows){
		if(err){
			res.json(myUtils.createDatabaseError(err));
		}else{
			dbConfig.query(query_call, [rows.insertId], function(err, rows){
				if(err){
					res.json(myUtils.createDatabaseError(err));
				}else{					
					res.json({returnCode: constants.SUCCESS_CODE, message: "Create call with " + dialog_id + " successfully.", data : {call :rows[0]}});
				}
			});
		}
	})	 	
};

function getPrice(req, res){
	var dialog_id 	= req.query.dialog_id;
	var query_call	= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
					  " WHERE " + constants.DIALOG_ID + " = ? AND "
					  			+ constants.IS_PAYMENT + " = ? ";
	dbConfig.query(query_call,[dialog_id, false], function(err, rows){
		if(rows && rows.length > 0){
			var call_price = rows[0];
		}else if(err){
			res.json(myUtils.createDatabaseError(err));
		}else{
			
		}
	});				  				
}