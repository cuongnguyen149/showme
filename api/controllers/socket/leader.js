'use strict';

var myUtils 			= require('../../../utility/utils');
var dbConfig			= require('../../../config/dbConfig');
var constants 			= require('../../../constants');
var geocoderProvider 	= 'google';
var httpAdapter 		= 'http';
var geocoder 			= require('node-geocoder')(geocoderProvider, httpAdapter);

exports = module.exports = function(io){
	var leader = {}; 
  	io.sockets.on('connection', function (socket) {
  		console.log("user connected");
	    /*
	    * update leader location 
	    * Param: user_id, address.	
	    */
	    socket.on('updateLeaderLocation', function (leaderObject) {
	    	console.log(leaderObject);
	    	var leaderObj = JSON.parse(leaderObject);
	    	if(leaderObj.user_id && leaderObj.lat && leaderObj.lng){
        		var update = "UPDATE " + constants.CLIENT_USER +
				          	 " SET " + constants.LATITUDE + " = ?, " 
				          	 		 + constants.LONGITUDE + " = ? " + 
				          	 " WHERE " + constants.USER_ID + " = ? ";
				var query = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
			                          " FROM " + constants.CLIENT_USER +
			                          " WHERE "  + constants.USER_ID + " = ?";
				dbConfig.query(update, [leaderObj.lat, leaderObj.lng, leaderObj.user_id], function(err, rows){
					if(rows){
						dbConfig.query(query, [leaderObj.user_id], function(err, rows){
							if(rows){
								socket.emit("updateLocationSuccess", {returnCode: constants.SUCCESS_CODE, message: "Updated location of leader " + leaderObj.user_id + " success!.", data: {user: rows[0]}});	
							}else{
								// console.log(err);
								socket.emit("updateLocationFalse", myUtils.createDatabaseError(err)); 
							}
						});
						
					}else{
						console.log(err);
						socket.emit("updateLocationFalse", myUtils.createDatabaseError(err)); 
					}	
				});
	    	}else{
	    		socket.emit("updateLocationFalse", myUtils.createErrorStr("Bad parameters!!", constants.ERROR_CODE));
	    	}
	    });
	    /*
	    * update leader location 
	    * Param: user_id, active.	
	    */
	    socket.on("updateLeaderStatus", function(leaderObject){
	    	var leaderObj = JSON.parse(leaderObject);
	    	console.log(leaderObj);
	    	leader[socket.id] =  leaderObj.user_id;
	    	var update = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.IS_ACTIVE + " = " + leaderObj.active +
	          	 " WHERE " + constants.USER_ID + " = ?";
			var query = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
		                          " FROM " + constants.CLIENT_USER +
		                          " WHERE "  + constants.USER_ID + " = ?";          	 
			dbConfig.query(update, [leaderObj.user_id], function(err, rows){
				if(rows && rows.affectedRows > 0){
					dbConfig.query(query, [leaderObj.user_id], function(err, rows){
						if(rows && rows.length > 0){
							if(leaderObj.active){

								socket.emit("updateStatusToActive", {returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObj.user_id + " to " + leaderObj.active +".", data: {user: rows[0]}});	
								// console.log(io.sockets.connected[socket.id]);
								// console.log(socket.server.eio.clientsCount);
							}else{
								socket.emit("updateStatusToInactive", {returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObj.user_id + " to " + leaderObj.active +".", data: {user: rows[0]}});	
								io.sockets.connected[socket.id].disconnect();
							}
							// console.log(socket.server.eio.clientsCount);
						}else{
							console.log(err);
							socket.emit("updateStatusFalse", myUtils.createDatabaseError(err));
						}
					});
				}else if(err){
					console.log(err);
					socket.emit("updateStatusFalse", myUtils.createDatabaseError(err));
				}else{
					socket.emit("updateStatusFalse", myUtils.createErrorStr("user_id: " +  leaderObj.user_id + " does not exist!", constants.ERROR_CODE));
				}
			});
	    });

	    socket.on('disconnect', function(leaderObject){
	    	console.log('user disconnected');
	    	console.log(leader[socket.id]);
	    	var update_inactive = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.IS_ACTIVE + " = " + false +
	          	 " WHERE " + constants.USER_ID + " = ?";
	        dbConfig.query(update_inactive, [leader[socket.id]], function(err, rows){
	        	if(err){
	        		console.log(err);
	        	}
	        });  	 
	  	});
 	});
}