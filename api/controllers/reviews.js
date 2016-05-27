'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var constants = require('../../constants');
module.exports = {
	createReview: createReview
};

function createReview (req, res){
	var reviewObject  	= req.swagger.params.review.value;
	var user_id 			= reviewObject.user_id,
		role				= reviewObject.role,
		leader_id 			= reviewObject.leader_id,
		rating_connection 	= reviewObject.rating_connection,
		rating_visit 		= reviewObject.rating_visit,
		rating_guide 		= reviewObject.rating_guide,
		rating_recommend	= reviewObject.rating_recommend,
		total_fee 			= reviewObject.total_fee,
		user_comment 		= reviewObject.user_comment,
		leader_comment      = reviewObject.leader_comment,
		call_start 			= reviewObject.call_start,
		call_end 			= reviewObject.call_end;
		if(new Date(call_start) == 'Invalid Date' || new Date(call_end) == 'Invalid Date'){
			call_end = call_start = new Date().toISOString().slice(0, 10);
		}
	var rating 		= (rating_recommend + rating_guide + rating_connection + rating_visit)/4;	
	var reviewStr  	= '{"' 		   + constants.USER_ID + '":"' + user_id + '", "'
								   + constants.LEADER_ID + '":"' + leader_id + '", "'
			                       + constants.RATING_CONNECTION + '":"' + rating_connection + '", "'
			                       + constants.RATING_VISIT + '":"' + rating_visit + '", "'
			                       + constants.RATING_GUIDE + '":"' + rating_guide + '", "' 
			                       + constants.RATING_RECOMMEND + '":"' + rating_recommend + '", "' 
			                       + constants.USER_COMMENT + '":"' + user_comment + '", "'
			                       + constants.LEADER_COMMENT + '":"' + leader_comment + '", "' 
			                       + constants.TOTAL_FEE + '":"' + total_fee + '", "'
			                       + constants.CALL_START + '":"' + call_start + '", "'
			                       + constants.CALL_END + '":"' + call_end + '"}',
        reviewObj 		= JSON.parse(reviewStr),
		insert_transaction  = "INSERT INTO " + constants.USER_TRANSACTION + " SET ?",
		query				= "SELECT * FROM " + constants.USER_TRANSACTION + 
							  " WHERE " + constants.TRANSACTION_ID + " = ?",
		update_rating		= "UPDATE " + constants.CLIENT_USER +
							  " SET "	+ constants.RATING + " = ((" + constants.RATING + "*" + constants.RATING_COUNTER + " + " + rating 								 + ")/(" + constants.RATING_COUNTER + " + 1)), "
							  			+ constants.RATING_CONNECTION + " = ((" + constants.RATING_CONNECTION + "*" + constants.RATING_COUNTER + " + " + rating_connection + ")/(" + constants.RATING_COUNTER + " + 1)), "
							  			+ constants.RATING_RECOMMEND + " = ((" + constants.RATING_RECOMMEND + "*" + constants.RATING_COUNTER+ " + " + rating_recommend 	 + ")/(" + constants.RATING_COUNTER + " + 1)), "
							  			+ constants.RATING_VISIT + " = ((" + constants.RATING_VISIT + "*" + constants.RATING_COUNTER+ " + " + rating_visit 				 + ")/(" + constants.RATING_COUNTER + " + 1)), "
							  			+ constants.RATING_GUIDE + " = ((" + constants.RATING_GUIDE + "*" + constants.RATING_COUNTER+ " + " + rating_guide 				 + ")/(" + constants.RATING_COUNTER + " + 1)), "
							  			+ constants.RATING_COUNTER + " = (" + constants.RATING_COUNTER + "+ 1)" +
							  " WHERE " + constants.USER_ID + " = ?";
							  // console.log(update_rating);
	var update_id = leader_id;						  
		if(role == 'user'){
			update_id = user_id;
		}						  
	dbConfig.query(update_rating, [update_id], function(err, rows){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err));
		}else{
			dbConfig.query(insert_transaction, reviewObj, function(err, rows){
				if(err){
					console.log(err);
					res.json(myUtils.createDatabaseError(err));
				}else{
					dbConfig.query(query, [rows.insertId], function(err, rows){
						if(err){
							console.log(err);
							res.json(myUtils.createDatabaseError(err));
						}else{
							res.json({returnCode: constants.SUCCESS_CODE, message : "Create review success.", data: {review: rows[0]}});
						}
					});	
				}
			}); 	
		}
	});
};