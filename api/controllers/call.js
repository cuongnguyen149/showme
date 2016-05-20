// 'use strict';

// var myUtils = require('../../utility/utils');
// var dbConfig = require('../../config/dbConfig');
// var constants = require('../../constants');
// module.exports = {
// 	createCall: createCall,
// 	getPrice : getPrice
// };
// function createCall (req, res){
// 	var callObject 			= req.swagger.params.call.value;
// 	var user_id 			= callObject.user_id,
// 		leader_id 			= callObject.leader_id,
// 		dialog_id			= callObject.dialog_id;
// 	var callStr 		= '{"'  + constants.USER_ID + '":"' + user_id + '", "'
// 	                     		+ constants.LEADER_ID + '":"' + leader_id + '", "' 
// 	                     		+ constants.DIALOG_ID + '":"' + dialog_id + '"}'; 
//     var callObj 		=  JSON.parse(callStr);	
// 	var insert_call 	= "INSERT INTO " + constants.TRANSACTION_PRICE + " SET ?",
// 		query_call 		= "SELECT * FROM " + constants.TRANSACTION_PRICE + " WHERE " + constants.ID + " = ?",
// 		check_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
// 					  	  " WHERE " + constants.DIALOG_ID + " = ? AND "
// 					  				+ constants.IS_PAYMENT + " = ? ";
// 	dbConfig.query(check_call,[dialog_id, false], function(err, rowsTransaction){
// 		if(err){
// 			res.json(myUtils.createDatabaseError(err));
// 		}else if(rowsTransaction && rowsTransaction.length > 0){
// 			res.json(myUtils.createErrorStr("Opps! You have a call does not pay yet! Please pay that call.", constants.ERROR_CODE));
// 		}else{
// 			dbConfig.query(insert_call, callObj, function(err, rows){
// 				if(err){
// 					res.json(myUtils.createDatabaseError(err));
// 				}else{
// 					dbConfig.query(query_call, [rows.insertId], function(err, rows){
// 						if(err){
// 							res.json(myUtils.createDatabaseError(err));
// 						}else{					
// 							res.json({returnCode: constants.SUCCESS_CODE, message: "Create call with " + dialog_id + " successfully.", data : {call :rows[0]}});
// 						}
// 					});
// 				}
// 			});	 		
// 		}
// 	});					  				
// };

// function getPrice(req, res){
// 	var dialog_id 		= req.query.dialog_id,
// 		role 			= req.query.role;
// 	var query_leader	= "SELECT * FROM " + constants.CLIENT_USER + 
// 					  	  " WHERE " + constants.USER_ID + " = ? ",
// 		query_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
// 					  	  " WHERE " + constants.DIALOG_ID + " = ? AND "
// 					  			+ constants.IS_PAYMENT + " = ? ";
// 	dbConfig.query(query_call,[dialog_id, false], function(err, rowsTransaction){
// 		if(rowsTransaction && rowsTransaction.length > 0){
// 			var now    = new Date().getTime(),
// 			call_price = rowsTransaction[0];
// 			dbConfig.query(query_leader, [call_price.leader_id], function(err, rowsLeader){
// 				if(err){
// 					res.json(myUtils.createDatabaseError(err));
// 				}else if (rowsLeader && rowsLeader.length > 0){
// 					var total_mins 	= (now - call_price.call_start.getTime())/60000, // Minutes of call.
// 						fee_per_min = rowsLeader[0].fee_per_hour/60;
// 					call_price.price = total_mins*fee_per_min;
// 					if(role && role == 'leader'){
// 						call_price.total = total_mins*fee_per_min + call_price.merchandise_fee + call_price.shipping_fee - call_price.service_fee; 
// 					}else{
// 						call_price.total = total_mins*fee_per_min + call_price.merchandise_fee + call_price.shipping_fee;
// 					}
					
// 					res.json({returnCode: constants.SUCCESS_CODE, message: "Get call price of " + dialog_id + " successfull.", data : {callPrice : call_price}});
// 				}else{
// 					res.json(myUtils.createErrorStr("Opps! The leader does not exist! Please check again.", constants.ERROR_CODE));
// 				}
// 			});
// 		}else if(err){
// 			res.json(myUtils.createDatabaseError(err));
// 		}else{
// 			res.json(myUtils.createErrorStr("Opps! Dont have call start create yet with "+ dialog_id +"! Please check again.", constants.ERROR_CODE));
// 		}
// 	});				  				
// }