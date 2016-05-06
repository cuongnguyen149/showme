'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
var geocoderProvider = 'google';
var httpAdapter = 'http';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);
module.exports = {
  leaderLocation: leaderLocation,
  updateLocation : updateLocation,
  updateStatus : updateStatus,
  getLeaderInfo : getLeaderInfo,
  leaderComment: leaderComment
};
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
function leaderComment(req, res){
	var user_id 	= req.query.user_id,
		page_size 	= parseInt(req.query.page_size),
		page_number = parseInt(req.query.page_number);
	var skip 		= (page_number-1)*page_size;	
	var query 		= "SELECT " + constants.USER_COMMENT + " ," 
								+ constants.CREATE_DATE +
				  	  " FROM " + constants.USER_TRANSACTION +
				  	  " WHERE "	+ constants.USER_ID + " = ?" +
				  	  " ORDER BY " + constants.CREATE_DATE + " DESC " +
				  	  " LIMIT "	+ skip + ", " + page_size;			  	  					
	dbConfig.query(query, [user_id], function(err, rows){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err));
		}else{
			res.json({returnCode: constants.SUCCESS_CODE, message: "Get comment for leader success.", data: {leader: rows}});
		}
	});				  	  
}