'use strict';
// var util = require('util');
var config = require('../../config/appConfig');
var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
module.exports = {
  leaderLocation: leaderLocation,
  updateLocation : updateLocation,
  updateStatus : updateStatus
};
/**
* GET leaders location in cirle API.
*/
function leaderLocation(req, res){
	var radius 	= parseFloat(req.query.radius),
		lat 	= parseFloat(req.query.lat),
		lng 	= parseFloat(req.query.lng);
	var query = "SELECT " + constants.USER_ID + ", " + constants.LATTITUDE + ", " + constants.LONGITUDE + 
				", ( 6371 * acos( cos( radians(" + lat + ") ) * cos( radians( "+  constants.LATTITUDE + " ) ) * cos( radians( " + constants.LONGITUDE + " ) - radians( " + lng + " ) ) + sin( radians( " + lat + " ) ) * sin(radians( "+ constants.LATTITUDE + " )) ) ) AS distance " +
				" FROM " + constants.CLIENT_USER +
				" HAVING distance < " + radius +
				" ORDER BY distance " + 
				"LIMIT 0 , 50;";
	dbConfig.query(query, function(err, rows){
		if(rows){
			res.json({returnCode: constants.SUCCESS_CODE, message : "Get location of leader sucess", data: rows});
		}else{
			res.json(myUtils.createDatabaseError(err)); 
		}	
	});			
};
/**
* Leader update leader's location API.
*/
function updateLocation(req, res){
	var leaderObject = req.swagger.params.leader.value,
		lat 	= parseFloat(leaderObject.lat),
		lng 	= parseFloat(leaderObject.lng);
	var update = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.LATTITUDE + " = " + lat + ", " 
	          	 		 + constants.LONGITUDE + " = " + lng +
	          	 " WHERE " + constants.USER_ID + " = "  + leaderObject.user_id;
	var query = "SELECT *, NULL AS " + constants.PWD + 
                          " FROM " + constants.CLIENT_USER +
                          " WHERE "  + constants.USER_ID + " = "  + leaderObject.user_id;          	 
	dbConfig.query(update, function(err, rows){
		if(rows){
			dbConfig.query(query, function(err, rows){
				if(rows){
					res.json({returnCode: constants.SUCCESS_CODE, message: "Updated location of leader " + leaderObject.user_id + " to lat/lng: " + lat+ "/" + lng + ".", data: {user: rows[0]}});	
				}else{
					res.json(myUtils.createDatabaseError(err)); 
				}
			});
			
		}else{
			res.json(myUtils.createDatabaseError(err)); 
		}
		
	});          	 
};
/**
* Leader update leader's status API.
*/
function updateStatus(req, res){
	var leaderObject = req.swagger.params.leader.value;
	var update = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.IS_ACTIVE + " = " + !leaderObject.active +
	          	 " WHERE " + constants.USER_ID + " = "  + leaderObject.user_id;
	var query = "SELECT *, NULL AS " + constants.PWD + 
                          " FROM " + constants.CLIENT_USER +
                          " WHERE "  + constants.USER_ID + " = "  + leaderObject.user_id;          	 
	dbConfig.query(update, function(err, rows){
		if(rows && rows.affectedRows != 0){
			console.log(rows);
			dbConfig.query(query, function(err, rows){
				if(rows && rows.length > 0){
					console.log(rows);
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
}