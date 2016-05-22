
'use strict';

var myUtils 			= require('../../../utility/utils');
var dbConfig			= require('../../../config/dbConfig');
var constants 			= require('../../../constants');

exports = module.exports = function(io){
	var call = {}; 
  	io.sockets.on('connection', function (socket) {

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
							call_price.price = total_mins*fee_per_min;
							if(role && role == 'leader'){
								call_price.total = total_mins*fee_per_min + call_price.merchandise_fee + call_price.shipping_fee - call_price.service_fee; 
							}else{
								call_price.total = total_mins*fee_per_min + call_price.merchandise_fee + call_price.shipping_fee;
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
  			var merchanParseJson 	= JSON.parse(merchanObject),
  				merchanInfo 		= {};
  			merchanInfo.merchandise_fee 	= merchanParseJson.merchandise_fee;
  			merchanInfo.shipping_fee		= merchanParseJson.shipping_fee;
  			merchanInfo.merchandise_type	= merchanParseJson.merchandise_type;
  			if(merchanInfo.merchandise_fee && merchanInfo.merchandise_type && merchanInfo.shipping_fee){
  				socket.emit("merchandiseRequestSuccess", {returnCode: constants.SUCCESS_CODE, message: "You have a merchandise request.", data : {merchanRequest : merchanInfo}});
  			}else{
  				socket.emit("merchandiseRequestFalse", myUtils.createErrorStr("Opps! Some information you provide incorrect! Please check again.", constants.ERROR_CODE));
  			}	
  		});

  		socket.on('acceptMerchandiseRequest', function(merchanObject){
  			var merchanParseJson 	= JSON.parse(merchanObject);
  			console.log(merchanParseJson);
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
							call_price.price 	= total_mins*fee_per_min;
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
	});
 };