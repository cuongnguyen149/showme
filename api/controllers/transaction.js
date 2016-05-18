'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var constants = require('../../constants');
module.exports = {
	createTransaction: createTransaction
};

function createTransaction (req, res){
	var transactionObject  	= req.swagger.params.transaction.value;
	var user_id 			= transactionObject.user_id,
		leader_id 			= transactionObject.leader_id,
		rating_connection 	= transactionObject.rating_connection,
		rating_visit 		= transactionObject.rating_visit,
		rating_guide 		= transactionObject.rating_guide,
		rating_recommend	= transactionObject.rating_recommend,
		total_fee 			= transactionObject.total_fee,
		user_comment 		= transactionObject.user_comment,
		call_start 			= transactionObject.call_start,
		call_end 			= transactionObject.call_end;
	var user_rating 		= (rating_recommend + rating_guide + rating_connection + rating_visit)/4;	
	var transactionStr  	= '{"' + constants.USER_ID + '":"' + user_id + '", "'
								   + constants.LEADER_ID + '":"' + leader_id + '", "'
			                       + constants.RATING_CONNECTION + '":"' + rating_connection + '", "'
			                       + constants.RATING_VISIT + '":"' + rating_visit + '", "'
			                       + constants.RATING_GUIDE + '":"' + rating_guide + '", "' 
			                       + constants.RATING_RECOMMEND + '":"' + rating_recommend + '", "' 
			                       + constants.USER_COMMENT + '":"' + user_comment + '", "' 
			                       + constants.TOTAL_FEE + '":"' + total_fee + '", "'
			                       + constants.CALL_START + '":"' + call_start + '", "'
			                       + constants.CALL_END + '":"' + call_end + '"}',
        transactionObj 		= JSON.parse(transactionStr),
		insert_transaction  = "INSERT INTO " + constants.USER_TRANSACTION + " SET ?",
		query				= "SELECT * FROM " + constants.USER_TRANSACTION + 
							  " WHERE " + constants.TRANSACTION_ID + " = ?",
		update_rating		= "UPDATE " + constants.CLIENT_USER +
							  " SET "	+ constants.RATING + " = ((" + constants.RATING + "*" + constants.RATING_COUNTER + " + " + user_rating + ")/(" + constants.RATING_COUNTER + " + 1)), "
							  			+ constants.RATING_COUNTER + " = (" + constants.RATING_COUNTER + "+ 1)" +
							  " WHERE " + constants.USER_ID + " = ?";
							  console.log(update_rating);
	dbConfig.query(update_rating, [leader_id], function(err, rows){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err));
		}else{
			dbConfig.query(insert_transaction, transactionObj, function(err, rows){
				if(err){
					res.json(myUtils.createDatabaseError(err));
				}else{
					dbConfig.query(query, [rows.insertId], function(err, rows){
						if(err){
							res.json(myUtils.createDatabaseError(err));
						}else{
							res.json({returnCode: constants.SUCCESS_CODE, message : "Create transaction success.", data: {transaction: rows[0]}});
						}
					});	
				}
			}); 	
		}
	});
};