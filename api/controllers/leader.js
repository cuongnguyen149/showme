'use strict';
// var util = require('util');
var config = require('../../config/appConfig');
var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
module.exports = {
  leaderLocation: leaderLocation,
  updateLocation : updateLocation
};

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
			res.json(rows);
		}else{
			res.json(myUtils.createError(err)); 
		}	
	});			
};

function updateLocation(req, res){
	var leaderObject = req.swagger.params.leader.value,
		lat 	= parseFloat(leaderObject.lat),
		lng 	= parseFloat(leaderObject.lng);
	var update = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.LATTITUDE + " = " + lat + ", " 
	          	 		 + constants.LONGITUDE + " = " + lng +
	          	 " WHERE " + constants.USER_ID + " = "  + leaderObject.user_id;
	dbConfig.query(update, function(err, rows){
		if(rows){
			res.status(200).json({message: "Updated location of user " + leaderObject.user_id + " to lattidute: " + lat + "/longitude: " + lng + "."});
		}else{
			res.json(myUtils.createError(err)); 
		}
		
	});          	 
};