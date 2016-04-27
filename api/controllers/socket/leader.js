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
	    	if(leaderObject.user_id && leaderObject.address){
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
						dbConfig.query(update, [resuls[0].latitude, resuls[0].longitude, leaderObject.address, leaderObject.user_id], function(err, rows){
							if(rows){
								dbConfig.query(query, [leaderObject.user_id], function(err, rows){
									if(rows){
										socket.emit("updateLocationSuccess", {returnCode: constants.SUCCESS_CODE, message: "Updated location of leader " + leaderObject.user_id + " to " + leaderObject.address + ".", data: {user: rows[0]}});	
									}else{
										socket.emit("updateLocationFalse", myUtils.createDatabaseError(err)); 
									}
								});
								
							}else{
								socket.emit("updateLocationFalse", myUtils.createDatabaseError(err)); 
							}	
						});
			        }else{
						socket.emit("updateLocationFalse", myUtils.createErrorStr("Your input address does not exist! Please try again.", constants.ERROR_CODE));
			        }
			    })
			    .catch(function(err) {
			        socket.emit("updateLocationFalse", myUtils.createErrorStr(err, constants.ERROR_CODE));
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
	    	leader[socket.id] =  leaderObject.user_id;
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
							if(leaderObject.active){
								socket.emit("updateStatusToActive", {returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObject.user_id + " to " + !leaderObject.active +".", data: {user: rows[0]}});	
								// console.log(io.sockets.connected[socket.id]);
								io.sockets.connected[socket.id].disconnect();
								// console.log(socket.server.eio.clientsCount);
							}else{
								socket.emit("updateStatusToInactive", {returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObject.user_id + " to " + !leaderObject.active +".", data: {user: rows[0]}});	
							}
							// console.log(socket.server.eio.clientsCount);
						}else{
							socket.emit("updateStatusFalse", myUtils.createDatabaseError(err));
						}
					});
				}else if(err){
					socket.emit("updateStatusFalse", myUtils.createDatabaseError(err));
				}else{
					socket.emit("updateStatusFalse", myUtils.createErrorStr("user_id: " +  leaderObject.user_id + " does not exist!", constants.ERROR_CODE));
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