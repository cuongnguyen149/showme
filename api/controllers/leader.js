'use strict';
// var util = require('util');
var config = require('../../config/appConfig');
var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
var constants = require('../../constants');
module.exports = {
  leaderLocation: leaderLocation
};

function leaderLocation(req, res){
	var user_id = req.query.user_id,
		lat 	= parseFloat(req.query.lat),
		lng 	= parseFloat(req.query.lng);
	var query = "SELECT " + constants.LEADER_ID + ", " + constants.LATTITUDE + ", " + constants.LONGITUDE + 
				", ( 6371 * acos( cos( radians(" + lat + ") ) * cos( radians( "+  constants.LATTITUDE + " ) ) * cos( radians( " + constants.LONGITUDE + " ) - radians( " + lng + " ) ) + sin( radians( " + lat + " ) ) * sin(radians( "+ constants.LATTITUDE + " )) ) ) AS distance " +
				" FROM " + constants.LEADER_USER +
				" HAVING distance < 2 " +
				"ORDER BY distance " + 
				"LIMIT 0 , 10;";
	dbConfig.query(query, function(err, rows){
		if(rows){
			res.json(rows);
		}else{
			res.json(myUtils.createError(err)); 
		}
		
	});			
}