'use strict';

var myUtils				= require('../../utility/utils');
var dbConfig 			= require('../../config/dbConfig');
var quickbloxConfig 	= require('../../config/quickbloxConfig');
var constants 			= require('../../constants');
var geocoderProvider 	= 'google';
var httpAdapter 		= 'http';
var _        			= require('underscore');
var geocoder 			= require('node-geocoder')(geocoderProvider, httpAdapter);
module.exports = {
  leaderLocation: leaderLocation,
  updateLocation : updateLocation,
  updateStatus : updateStatus,
  getLeaderInfo : getLeaderInfo,
  comment: comment,
  leaderStatistical: leaderStatistical,
  getAllLeaderActive: getAllLeaderActive
};
/**
* GET All leaders location API.
*/
function getAllLeaderActive(req, res){
	var query = "SELECT * , DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
				" FROM " + constants.CLIENT_USER + 
				" WHERE " + constants.ROLE + " = ? " + 
				" AND "   + constants.IS_ACTIVE + " = ? ";
	dbConfig.query(query, ['leader', true], function(err, rows){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err)); 
		}else{
			res.json({returnCode: constants.SUCCESS_CODE, message : "Get all leader location success", data: {leaders : rows}});
		}
	});			
}
/**
* GET leaders location in cirle API.
*/
function leaderLocation(req, res){
	var radius 	= parseFloat(req.query.radius),
		lat 	= parseFloat(req.query.lat),
		lng 	= parseFloat(req.query.lng),
		address = req.query.address;
	if(!radius){
		radius = 5;
	}
	if(address){
		geocoder.geocode(address)
	    .then(function(resuls) {
	    	if(resuls && resuls.length > 0){
	    		// console.log(resuls);
		    		lat 		= resuls[0].latitude;
		    		lng 		= resuls[0].longitude;
	    		var addressFull = resuls[0].formattedAddress,
	    			addressObject = {latitude: lat, longitude: lng, addressFull: addressFull};
	    		var query = "SELECT " + constants.USER_ID + ", "
	    							  +	constants.AVATAR + ", " 
	    							  + constants.LATITUDE + ", " 
	    							  + constants.LONGITUDE + ", " 
	    							  + constants.FIRSTNAME + ", " 
	    							  + constants.LASTNAME + ", " 
	    							  + constants.RATING + ", " 
	    							  + constants.LANGUAGE + ", "
	    							  + constants.FEE_PER_HOUR + ", "
	    							  + constants.POSSIBLE_PURCHASE +
							", ( 6371 * acos( cos( radians(" + lat + ") ) * cos( radians( "+  constants.LATITUDE + " ) ) * cos( radians( " + constants.LONGITUDE + " ) - radians( " + lng + " ) ) + sin( radians( " + lat + " ) ) * sin(radians( "+ constants.LATITUDE + " )) ) ) AS distance " +
							" FROM " + constants.CLIENT_USER +
							" WHERE " + constants.ROLE + " = ? AND "
									  + constants.IS_ACTIVE + " = ?" + 
							" HAVING distance <= " + radius +
							" ORDER BY distance;";
				dbConfig.query(query, [constants.LEADER, true], function(err, rows){
					if(rows){
						res.json({returnCode: constants.SUCCESS_CODE, message : "Get location of leader success", data: {leaders : rows, searched: addressObject}});
					}else{
						console.log(err);
						res.json(myUtils.createDatabaseError(err)); 
					}	
				});
	    	}else{
	    		res.json(myUtils.createErrorStr("Your input address does not exist! Please try again.", constants.ERROR_CODE));
	    	}
	    })
	    .catch(function(err) {
	        res.json(myUtils.createErrorStr("Opps! something wrong with get leader location", constants.ERROR_CODE));
	    });	
	}else if(lat && lng && lat != 0.0 && lng != 0.0){
		var addressObject = {latitude: lat, longitude: lng, addressFull: ""};
		var query = "SELECT " + constants.USER_ID + ", "
							  +	constants.AVATAR + ", " 
							  + constants.LATITUDE + ", " 
							  + constants.LONGITUDE + ", " 
							  + constants.FIRSTNAME + ", " 
							  + constants.LASTNAME + ", " 
							  + constants.RATING + ", " 
							  + constants.LANGUAGE + ", "
							  + constants.FEE_PER_HOUR + ", "
							  + constants.POSSIBLE_PURCHASE +
					", ( 6371 * acos( cos( radians(" + lat + ") ) * cos( radians( "+  constants.LATITUDE + " ) ) * cos( radians( " + constants.LONGITUDE + " ) - radians( " + lng + " ) ) + sin( radians( " + lat + " ) ) * sin(radians( "+ constants.LATITUDE + " )) ) ) AS distance " +
					" FROM " + constants.CLIENT_USER +
					" WHERE " + constants.ROLE + " = ? AND "
							  + constants.IS_ACTIVE + " = ?" + 
					" HAVING distance <= " + radius +
					" ORDER BY distance;";
		dbConfig.query(query, [constants.LEADER, true], function(err, rows){
			if(rows){
				res.json({returnCode: constants.SUCCESS_CODE, message : "Get location of leader success", data: {leaders : rows,  searched: addressObject}});
			}else{
				console.log(err);
				res.json(myUtils.createDatabaseError(err)); 
			}	
		});
	}else{
		res.json(myUtils.createErrorStr("Your params incorrect! Please check again.", constants.ERROR_CODE));
	}	
	 			
};
/**
* Leader update leader's location API.
*/
function updateLocation(req, res){
	var leaderObject = req.swagger.params.leader.value;
	var user_id = leaderObject.user_id;
	geocoder.geocode(leaderObject.address)
	    .then(function(resuls) {
	        if(resuls && resuls.length > 0){
        		var update = "UPDATE " + constants.CLIENT_USER +
				          	 " SET " + constants.LATITUDE + " = ?, " 
				          	 		 + constants.LONGITUDE + " = ?, " 
				          	 		 + constants.ADDRESS + " = ? " +
				          	 " WHERE " + constants.USER_ID + " = ? ";
				var query = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
			                          " FROM " + constants.CLIENT_USER +
			                          " WHERE "  + constants.USER_ID + " = ?";          	 
				dbConfig.query(update, [resuls[0].latitude, resuls[0].longitude, leaderObject.address, user_id], function(err, rows){
					if(rows){
						dbConfig.query(query, [user_id], function(err, rows){
							if(rows){
								res.json({returnCode: constants.SUCCESS_CODE, message: "Updated location of leader " + user_id + " to " + leaderObject.address + ".", data: {user: rows[0]}});	
							}else{
								// console.log(err);
								res.json(myUtils.createDatabaseError(err)); 
							}
						});
						
					}else{
						console.log(err);
						res.json(myUtils.createDatabaseError(err)); 
					}	
				});
	        }else{
				res.json(myUtils.createErrorStr("Your input address does not exist! Please try again.", constants.ERROR_CODE));
	        }
	    })
	    .catch(function(err) {
	        res.json(myUtils.createErrorStr(err, constants.ERROR_CODE));
	    });          	 
};
/**
* Leader update leader's status API.
*/
function updateStatus(req, res){
	var leaderObject = req.swagger.params.leader.value;
	var update = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.IS_ACTIVE + " = " + !leaderObject.active +
	          	 " WHERE " + constants.USER_ID + " = ?";
	var query = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
                          " FROM " + constants.CLIENT_USER +
                          " WHERE "  + constants.USER_ID + " = ?";          	 
	dbConfig.query(update, [leaderObject.user_id], function(err, rows){
		if(rows && rows.affectedRows > 0){
			dbConfig.query(query, [leaderObject.user_id], function(err, rows){
				if(rows && rows.length > 0){
					res.json({returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObject.user_id + " to " + !leaderObject.active +".", data: {user: rows[0]}});	
				}else{
					res.json(myUtils.createDatabaseError(err));
				}
			});
		}else if(err){
			res.json(myUtils.createDatabaseError(err));
		}else{
			res.json(myUtils.createErrorStr("user_id: " +  leaderObject.user_id + " does not exist!", constants.ERROR_CODE));
		}
	});
};
/**
* Leader get leader's information API.
*/
function getLeaderInfo(req, res){
	var user_id = req.swagger.params.user_id.value;
	var query   = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
	              " FROM " + constants.CLIENT_USER +
	              " WHERE "  + constants.USER_ID + " = ?";
	dbConfig.query(query, [user_id], function(err, rows){
		if(rows && rows.length > 0){
			res.json({returnCode: constants.SUCCESS_CODE, message: "Get information of leader success.", data: {user: rows[0]}});
		}else if(err){
			res.json(myUtils.createDatabaseError(err));
		}else{
			res.json(myUtils.createErrorStr("user_id: " +  user_id + " does not exist!", constants.ERROR_CODE));
		}
	});             
};
/**
* Leader get leader comment API.
*/
function comment(req, res){
	var user_id 	= req.query.user_id,
		role 		= req.query.role,
		type		= req.query.type,	
		page_size 	= parseInt(req.query.page_size),
		page_number = parseInt(req.query.page_number);
	var skip 		= (page_number-1)*page_size;
	if(type == 'one'){
		if(role == 'user' ){
			var query 	= "SELECT " + constants.CLIENT_USER + "." + constants.USER_ID + ", "
									+ constants.CLIENT_USER + "." + constants.AVATAR + ", "
									+ constants.CLIENT_USER + "." + constants.FIRSTNAME + ", "
									+ constants.CLIENT_USER + "." + constants.LASTNAME + ", "
									+ constants.USER_TRANSACTION + "." + constants.LEADER_COMMENT + " AS comment, "
									+ constants.USER_TRANSACTION + "." + constants.ROLE + ", "
									+ constants.USER_TRANSACTION + "." + constants.CREATE_DATE +  
				  	  " FROM "		+ constants.CLIENT_USER +
				  	  " LEFT JOIN " + constants.USER_TRANSACTION +
				  	  " ON " 		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.USER_TRANSACTION + "." + constants.LEADER_ID +
				  	  " WHERE " 	+ constants.USER_TRANSACTION	+ "." + constants.USER_ID + " = ?" +
				  	  " AND " 		+ constants.USER_TRANSACTION + "."+ constants.LEADER_COMMENT + " <> ''" +
				  	  " ORDER BY "  + constants.USER_TRANSACTION + "."+ constants.CREATE_DATE  + " DESC " +
				  	  " LIMIT "		+ skip + ", " + page_size;
		}else{
			var query 	= "SELECT " + constants.CLIENT_USER + "." + constants.USER_ID + ", "
									+ constants.CLIENT_USER + "." + constants.AVATAR + ", "
									+ constants.CLIENT_USER + "." + constants.FIRSTNAME + ", "
									+ constants.CLIENT_USER + "." + constants.LASTNAME + ", "
									+ constants.USER_TRANSACTION + "." + constants.ROLE + ", "
									+ constants.USER_TRANSACTION + "."+ constants.USER_COMMENT + " AS comment, " 
									+ constants.USER_TRANSACTION + "."+ constants.CREATE_DATE +  
				  	  " FROM "		+ constants.CLIENT_USER +
				  	  " LEFT JOIN " + constants.USER_TRANSACTION +
				  	  " ON " 		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.USER_TRANSACTION + "." + constants.USER_ID +
				  	  " WHERE " 	+ constants.USER_TRANSACTION	+ "." + constants.LEADER_ID + " = ?" +
				  	  " AND " 		+ constants.USER_TRANSACTION + "."+ constants.USER_COMMENT + " <> ''" +				 
				  	  " ORDER BY "  + constants.USER_TRANSACTION + "."+ constants.CREATE_DATE  + " DESC " +
				  	  " LIMIT "		+ skip + ", " + page_size;
		}
	}else{
		if(role == 'user'){
			var query 	= "SELECT " + constants.CLIENT_USER + "." + constants.USER_ID + ", "
									+ constants.CLIENT_USER + "." + constants.AVATAR + ", "
									+ constants.CLIENT_USER + "." + constants.FIRSTNAME + ", "
									+ constants.CLIENT_USER + "." + constants.LASTNAME + ", "
									+ constants.USER_TRANSACTION + "." + constants.ROLE + ", "
									+ constants.USER_TRANSACTION + "."+ constants.LEADER_COMMENT + ", "
									+ constants.USER_TRANSACTION + "."+ constants.LEADER_ID + ", "
									+ constants.USER_TRANSACTION + "."+ constants.USER_COMMENT + ", "
									+ constants.USER_TRANSACTION + "."+ constants.CREATE_DATE +  
				  	  " FROM "		+ constants.CLIENT_USER +
				  	  " LEFT JOIN " + constants.USER_TRANSACTION +
				  	  " ON " 		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.USER_TRANSACTION + "." + constants.USER_ID +
				  	  " OR "		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.USER_TRANSACTION + "." + constants.LEADER_ID +
				  	  " WHERE " 	+ constants.USER_TRANSACTION	+ "." + constants.USER_ID + " = ?" +				 
				  	  " ORDER BY "  + constants.USER_TRANSACTION + "."+ constants.CREATE_DATE  + " DESC " +
				  	  " LIMIT "		+ skip + ", " + page_size;
		}else{
			var query 	= "SELECT " + constants.CLIENT_USER + "." + constants.USER_ID + ", "
									+ constants.CLIENT_USER + "." + constants.AVATAR + ", "
									+ constants.CLIENT_USER + "." + constants.FIRSTNAME + ", "
									+ constants.CLIENT_USER + "." + constants.LASTNAME + ", "
									+ constants.USER_TRANSACTION + "." + constants.ROLE + ", "
									+ constants.USER_TRANSACTION + "."+ constants.LEADER_COMMENT + ", "
									+ constants.USER_TRANSACTION + "."+ constants.LEADER_ID + ", "
									+ constants.USER_TRANSACTION + "."+ constants.USER_COMMENT + ", "
									+ constants.USER_TRANSACTION + "."+ constants.CREATE_DATE +  
				  	  " FROM "		+ constants.CLIENT_USER +
				  	  " LEFT JOIN " + constants.USER_TRANSACTION +
				  	  " ON " 		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.USER_TRANSACTION + "." + constants.USER_ID +
				  	  " OR "		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.USER_TRANSACTION + "." + constants.LEADER_ID +
				  	  " WHERE " 	+ constants.USER_TRANSACTION	+ "." + constants.LEADER_ID + " = ?" +				 
				  	  " ORDER BY "  + constants.USER_TRANSACTION + "."+ constants.CREATE_DATE  + " DESC " +
				  	  " LIMIT "		+ skip + ", " + page_size;
		}
	}		  	  					
	dbConfig.query(query, [user_id], function(err, rows){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err));
		}else{
			if(type == 'all'){
				var newRows = _.reject(rows, function(value, key, object){
					return (value.user_id == value.leader_id && value.role == 'user') || (value.user_id != value.leader_id && value.role == 'leader') ;
				});
				// var newRows = rows;
				newRows.forEach(function(data){
					_.omit(data, function(value, key, object){
						if(_.isEqual(value, "")){
							delete data[key];
						}
						if (_.isEqual(key, "leader_comment") && !_.isEqual(value, "") ){
							data.comment = value;
							delete data[key];
						}
						if (_.isEqual(key, "user_comment") && !_.isEqual(value, "") ){
							data.comment = value;
							delete data[key];
						}
					}); 
				});
				res.json({returnCode: constants.SUCCESS_CODE, message: "Get comment success.", data: {comment: newRows}});	
			}else{
				res.json({returnCode: constants.SUCCESS_CODE, message: "Get comment success.", data: {comment: rows}});	
			}
		}
	});				  	  
}
/**
* Leader get leader statistical API.
*/
function leaderStatistical(req, res){
	var user_id 	= req.query.user_id,
		page_size 	= parseInt(req.query.page_size),
		page_number = parseInt(req.query.page_number);
		var skip 	= (page_number-1)*page_size;
		var query 	= "SELECT " 	+ constants.CLIENT_USER + "." + constants.USER_ID + ", "
									+ constants.CLIENT_USER + "." + constants.AVATAR + ", "
									+ constants.CLIENT_USER + "." + constants.FIRSTNAME + ", "
									+ constants.CLIENT_USER + "." + constants.LASTNAME + ", "
									+ constants.TRANSACTION_PRICE + "."+ constants.TOTAL + ", "
									+ constants.TRANSACTION_PRICE + "."+ constants.LIST_NUMBER_MERCHANDISE + ", "
									+ constants.TRANSACTION_PRICE + "."+ constants.CALL_START +  
				  	  " FROM "		+ constants.CLIENT_USER +
				  	  " LEFT JOIN " + constants.TRANSACTION_PRICE +
				  	  " ON " 		+ constants.CLIENT_USER + "." + constants.USER_ID  + " = " + constants.TRANSACTION_PRICE + "." + constants.USER_ID +
				  	  " WHERE " 	+ constants.TRANSACTION_PRICE	+ "." + constants.LEADER_ID + " = ?" +
				  	  " ORDER BY "  + constants.TRANSACTION_PRICE + "."+ constants.CALL_START  + " DESC " +
				  	  " LIMIT "	+ skip + ", " + page_size;
		var get_SUM_total = "SELECT SUM ("+ constants.TRANSACTION_PRICE + "."+ constants.TOTAL + ") AS total_header " +	
							"FROM "	 + constants.TRANSACTION_PRICE +
							" WHERE "  + constants.LEADER_ID + " = ?";
		var get_count	  =	"SELECT COUNT(*) AS total_visit FROM " + constants.TRANSACTION_PRICE + 
							" WHERE "  + constants.LEADER_ID + " = ?";
			
	dbConfig.query(get_SUM_total, [user_id], function(err, sumToltal){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err));
		}else{
			dbConfig.query(get_count, [user_id], function(err, visitCount){
				if(err){
					console.log(err);
					res.json(myUtils.createDatabaseError(err));
				}else{
					dbConfig.query(query, [user_id], function(err, rows){
						if(err){
							console.log(err);
							res.json(myUtils.createDatabaseError(err));
						}else{
							if(!sumToltal[0].total_header){
								sumToltal[0].total_header = 0;
							}
							res.json({returnCode: constants.SUCCESS_CODE, message: "Get statistical for leader success.", data: {total_visit: visitCount[0].total_visit, total_header: sumToltal[0].total_header, leader: rows}});
						}
					});	
				}
			});
		}
	});								  	  				  	  
};