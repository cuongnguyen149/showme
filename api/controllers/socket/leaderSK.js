'use strict';

var myUtils 			= require('../../../utility/utils');
var dbConfig			= require('../../../config/dbConfig');
var constants 			= require('../../../constants');
var geocoderProvider 	= 'google';
var httpAdapter 		= 'http';
var geocoder 			= require('node-geocoder')(geocoderProvider, httpAdapter);

exports = module.exports = function(io){
	var leader = {},
		call   = {}; 
  	io.sockets.on('connection', function (socket) {
  		console.log(socket.id);
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
	    	leader[socket.id] =  leaderObj.user_id;

	    	var update = "UPDATE " + constants.CLIENT_USER +
	          	 " SET " + constants.IS_ACTIVE + " = " + leaderObj.active +
	          	 " WHERE " + constants.USER_ID + " = ?";
			var query = "SELECT *, NULL AS " + constants.PWD + ", DATE_FORMAT( " + constants.DOB + ", '%Y-%m-%d') AS "+  constants.DOB +
		                          " FROM " + constants.CLIENT_USER +
		                          " WHERE "  + constants.USER_ID + " = ?";          	 
			dbConfig.query(update, [leaderObj.user_id], function(err, rows){
				if(err){
					socket.emit("updateStatusFalse", myUtils.createDatabaseError(err));
				}else{
					dbConfig.query(query, [leaderObj.user_id], function(err, rows){
						if(rows && rows.length > 0){
							if(leaderObj.active){
								call[leaderObject.user_id] = socket.id;
								console.log('update true: ' + call[leaderObject.user_id]);
								socket.emit("updateStatusToActive", {returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObj.user_id + " to " + leaderObj.active +".", data: {user: rows[0]}});	
								// console.log(io.sockets.connected[socket.id]);
								// console.log(socket.server.eio.clientsCount);
							}else{
								socket.emit("updateStatusToInactive", {returnCode: constants.SUCCESS_CODE, message: "Updated status of leader " + leaderObj.user_id + " to " + leaderObj.active +".", data: {user: rows[0]}});	
								io.sockets.connected[socket.id].disconnect();
							}
							// console.log(socket.server.eio.clientsCount);
						}else if(err){
							socket.emit("updateStatusFalse", myUtils.createDatabaseError(err));
						}else{
							socket.emit("updateStatusFalse", myUtils.createErrorStr("user_id: " +  leaderObj.user_id + " does not exist!", constants.ERROR_CODE));
						}
					});
					
				}
			});
	    });

	    socket.on('callStart', function(callObject){
  			var callParseJson 	= JSON.parse(callObject);
  			var user_id 		= callParseJson.user_id,
  				leader_id 		= callParseJson.leader_id,
  				dialog_id 		= callParseJson.dialog_id;
  			var callStrInsert 	= '{"'  + constants.USER_ID + '":"' + user_id + '", "'
			                     		+ constants.LEADER_ID + '":"' + leader_id + '", "' 
			                     		+ constants.DIALOG_ID + '":"' + dialog_id + '"}'; 
			var callObjInsert	=  JSON.parse(callStrInsert);	
			var insert_call 	= "INSERT INTO " + constants.TRANSACTION_PRICE + " SET ?",
				query_call 		= "SELECT * FROM " + constants.TRANSACTION_PRICE + " WHERE " + constants.ID + " = ?",
				check_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
							  	  " WHERE " + constants.DIALOG_ID + " = ? AND "
							  				+ constants.IS_PAYMENT + " = ? ";
			dbConfig.query(check_call,[dialog_id, false], function(err, rowsTransaction){
				if(err){
					socket.emit("callStartFalse", myUtils.createDatabaseError(err));
				}else if(rowsTransaction && rowsTransaction.length > 0){
					socket.emit("callStartFalse", myUtils.createErrorStr("Opps! You have a call does not pay yet! Please pay that call.", constants.ERROR_CODE));
				}else{
					dbConfig.query(insert_call, callObjInsert, function(err, rows){
						if(err){
							socket.emit("callStartFalse", myUtils.createDatabaseError(err));
						}else{
							dbConfig.query(query_call, [rows.insertId], function(err, rows){
								if(err){
									socket.emit("callStartFalse", myUtils.createDatabaseError(err));
								}else{
									rows[0].min   = 0;
									rows[0].total = 0;					
									socket.emit("callStartSuccess", {returnCode: constants.SUCCESS_CODE, message: "Create call with " + dialog_id + " successfully.", data : {call :rows[0]}});

								}
							});
						}
					});	 		
				}
			});
  		});

  		socket.on('getPrice', function(callObject){
  			var callParseJson 	= JSON.parse(callObject);
  			var id 				= callParseJson.id,
				role 			= callParseJson.role;
			var query_leader	= "SELECT * FROM " + constants.CLIENT_USER + 
							  	  " WHERE " + constants.USER_ID + " = ? ",
				query_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
							  	  " WHERE " + constants.ID + " = ? ";
			dbConfig.query(query_call, id, function(err, rowsTransaction){
				if(rowsTransaction && rowsTransaction.length > 0){
					var now    = new Date().getTime(),
					call_price = rowsTransaction[0];
					dbConfig.query(query_leader, [call_price.leader_id], function(err, rowsLeader){
						if(err){
							socket.emit("getPriceFalse", myUtils.createDatabaseError(err));
						}else if (rowsLeader && rowsLeader.length > 0){
							var total_mins 	= (now - call_price.call_start.getTime())/60000, // Minutes of call.
								fee_per_min = rowsLeader[0].fee_per_hour/60;
							call_price.price = (total_mins*fee_per_min).toFixed(2);
							call_price.min   = parseInt(total_mins.toFixed(0));
							if(role && role == 'leader'){
								call_price.total = (total_mins*fee_per_min + call_price.merchandise_fee + call_price.shipping_fee - call_price.service_fee).toFixed(2); 
							}else{
								call_price.total = (total_mins*fee_per_min + call_price.merchandise_fee + call_price.shipping_fee).toFixed(2);
							}
							
							socket.emit("getPriceSuccess", {returnCode: constants.SUCCESS_CODE, message: "Get call price of " + id + " successfull.", data : {call : call_price}});
						}else{
							socket.emit("getPriceFalse", myUtils.createErrorStr("Opps! The leader does not exist! Please check again.", constants.ERROR_CODE));
						}
					});
				}else if(err){
					socket.emit("getPriceFalse", myUtils.createDatabaseError(err));
				}else{
					socket.emit("getPriceFalse", myUtils.createErrorStr("Opps! Dont have call start create yet with "+ id +"! Please check again.", constants.ERROR_CODE));
				}
			});	
  		});

  		socket.on('merchandiseRequest', function(merchanObject){
  			console.log(call[leader_id]);
  			var x = call[leader_id]; console.log(x);
  			var merchanParseJson 	= JSON.parse(merchanObject),
  				merchanInfo 		= {};
  			var leader_id 					= merchanParseJson.leader_id;	
  			merchanInfo.merchandise_fee 	= merchanParseJson.merchandise_fee;
  			merchanInfo.shipping_fee		= merchanParseJson.shipping_fee;
  			merchanInfo.merchandise_type	= merchanParseJson.merchandise_type;
  			if(merchanInfo.merchandise_fee && merchanInfo.merchandise_type && merchanInfo.shipping_fee){
  				
  				io.to(x).emit("merchandiseRequestSuccess", {returnCode: constants.SUCCESS_CODE, message: "You have a merchandise request.", data : {merchanRequest : merchanInfo}});
  				// io.sockets.socket(call[leader_id]).emit("merchandiseRequestSuccess", {returnCode: constants.SUCCESS_CODE, message: "You have a merchandise request.", data : {merchanRequest : merchanInfo}});
  			}else{
  				socket.emit("merchandiseRequestFalse", myUtils.createErrorStr("Opps! Some information you provide incorrect! Please check again.", constants.ERROR_CODE));
  			}	
  		});

  		socket.on('acceptMerchandiseRequest', function(merchanObject){
  			var merchanParseJson 	= JSON.parse(merchanObject);
  			var merchandise_fee 	= merchanParseJson.merchandise_fee,
  			shipping_fee			= merchanParseJson.shipping_fee,
  			id 						= merchanParseJson.id;
  			var update_call 		= "UPDATE " + constants.TRANSACTION_PRICE + 
  									  " SET " 	+ constants.MERCHANDISE_FEE + " = ?, "
  									  			+ constants.SHIPPING_FEE + " = ? " +
  									  " WHERE "	+ constants.ID	+ " = ? ";
  			var query_call			= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
							  	  	  " WHERE " + constants.ID + " = ? ";			  			
  			if(merchandise_fee && shipping_fee && id){
  				dbConfig.query(update_call,[merchandise_fee, shipping_fee, id], function(err, rows){
  					if(err){
  						socket.emit("acceptMerchandiseRequestFalse", myUtils.createDatabaseError(err));
  					}else{
  						dbConfig.query(query_call, id, function(err, rows){
  							if(err){
  								socket.emit("acceptMerchandiseRequestFalse", myUtils.createDatabaseError(err));		
  							}else if(rows && rows.length > 0){
  								socket.emit("acceptMerchandiseRequestSuccess", {returnCode: constants.SUCCESS_CODE, message: "Updated merchandies request successfull.", data : {call : rows[0]}});
  							}else{
  								socket.emit("acceptMerchandiseRequestFalse", myUtils.createErrorStr("Opps! Id: " + id+ " you provide incorrect! Please check again.", constants.ERROR_CODE));
  							}
  						});
  						
  					}
  				});
  			}else{
  				socket.emit("acceptMerchandiseRequestFalse", myUtils.createErrorStr("Opps! Some information you provide incorrect! Please check again.", constants.ERROR_CODE));
  			}	
  		});

  		socket.on('refuseMerchandiseRequest', function(merchanObject){
  			var merchanParseJson 	= JSON.parse(merchanObject),
  				merchanInfo 		= {};
  			merchanInfo.merchandise_fee 	= merchanParseJson.merchandise_fee;
  			merchanInfo.shipping_fee		= merchanParseJson.shipping_fee;
  			merchanInfo.merchandise_type	= merchanParseJson.merchandise_type;
  			if(merchanInfo.merchandise_fee && merchanInfo.merchandise_type && merchanInfo.shipping_fee){
  				socket.emit("refuseMerchandiseRequestSuccess", {returnCode: constants.SUCCESS_CODE, message: "Your merchandise buy request was refuse.", data : {merchanRequest : merchanInfo}});
  			}else{
  				socket.emit("refuseMerchandiseRequestFalse", myUtils.createErrorStr("Opps! Some information you provide incorrect! Please check again.", constants.ERROR_CODE));
  			}	
  		});
  		socket.on('getCallByUserId', function(callObject){
  			var callParseJson 	= JSON.parse(callObject);
  			var	user_id 		= callParseJson.user_id,
  				query_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
							  	  " WHERE " + constants.USER_ID + " = ? " + 
							  	  " ORDER BY " + constants.CALL_START + " DESC " +
							  	  " LIMIT 1 ";
  			dbConfig.query(query_call, user_id, function(err, rows){
  				if(err){
  					socket.emit("getCallByUserIdFail", myUtils.createDatabaseError(err));
  				}else if(rows && rows.length > 0){
  					rows[0].total = 0;
  					socket.emit("getCallByUserIdSuccess", {returnCode: constants.SUCCESS_CODE, message: "Get call success", data : {call : rows[0]}});
  				}else{
  					socket.emit("getCallByUserIdFail", myUtils.createErrorStr("Opps! The user_id: " + user_id + " does not exist! Please check again.", constants.ERROR_CODE));
  				}
  			});
  		});
  		socket.on('callEnd', function(callObject){
  			var callParseJson 	= JSON.parse(callObject);
  			var id 				= callParseJson.id;
  			var update_call 	= "UPDATE " + constants.TRANSACTION_PRICE + 
  								  " SET " 	+ constants.PRICE + " = ?, " 
  									  		+ constants.CALL_END + " = ? " +
  								  " WHERE "	+ constants.ID	+ " = ? ",
				query_leader	= "SELECT * FROM " + constants.CLIENT_USER + 
	  	  						  " WHERE " + constants.USER_ID + " = ? ",
				query_call		= "SELECT * FROM " + constants.TRANSACTION_PRICE + 
					  	  		  " WHERE " + constants.ID + " = ? ";
			dbConfig.query(query_call, id, function(err, rowsTransaction){
				if(rowsTransaction && rowsTransaction.length > 0){
					var now    = new Date().getTime(),
					call_price = rowsTransaction[0];
					dbConfig.query(query_leader, [call_price.leader_id], function(err, rowsLeader){
						if(err){
							socket.emit("callEndFalse", myUtils.createDatabaseError(err));
						}else if (rowsLeader && rowsLeader.length > 0){
							var total_mins 		= (now - call_price.call_start.getTime())/60000, // Minutes of call.
								fee_per_min 	= rowsLeader[0].fee_per_hour/60;
							call_price.price 	= (total_mins*fee_per_min).toFixed(2);
							call_price.call_end = new Date();
							dbConfig.query(update_call, [call_price.price, call_price.call_end, id], function(err, rows){
								console.log(rows);
								if(err){
									socket.emit("callEndFalse", myUtils.createDatabaseError(err));
								}else{
									dbConfig.query(query_call, id, function(err, rows){
			  							if(err){
			  								socket.emit("callEndFalse", myUtils.createDatabaseError(err));
			  							}else{
			  								rows[0].min   = parseInt(total_mins.toFixed(0));
			  								rows[0].total = 0;
			  								socket.emit("callEndSuccess", {returnCode: constants.SUCCESS_CODE, message: "End call " + id + " successfull.", data : {call: rows[0]}});
			  							}
		  							});
  									
								}
							});
						}else{
							socket.emit("callEndFalse", myUtils.createErrorStr("Opps! The leader does not exist! Please check again.", constants.ERROR_CODE));
						}
					});
				}else if(err){
					socket.emit("callEndFalse", myUtils.createDatabaseError(err));
				}else{
					socket.emit("callEndFalse", myUtils.createErrorStr("Opps! Dont have call start create yet with "+ id +"! Please check again.", constants.ERROR_CODE));
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