'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var constants = require('../../constants');
var quickbloxConfig = require('../../config/quickbloxConfig');
module.exports = {
	listDialog: listDialog,
	listMessage: listMessage,
	createDialog: createDialog
};

function listDialog(req, res){
	var user_id 	= req.query.user_id,
		page_size   = parseInt(req.query.page_size),
		page_number = parseInt(req.query.page_number);
 	var query_user 	= "SELECT " + constants.EMAIL + ", " + constants.PWD +
                  	  " FROM " + constants.CLIENT_USER +
                  	  " WHERE "  + constants.USER_ID + " = ?";
    dbConfig.query(query_user, [user_id], function(err, rows){
    	if(rows && rows.length > 0){
    		quickbloxConfig.createSession({email: rows[0].email, password: rows[0].pwd}, function(err, res) {
			  	if(res){
				    var skip = page_number*page_size,
				    	filters = {"limit": page_size, "skip": skip, "sort_desc": "last_message_date_sent"};
					quickbloxConfig.chat.dialog.list(filters, function(err, resDialogs) {
						if(err){
						 	res.json(myUtils.createQuickBloxError(err));
						}else{
							console.log(resDialogs);	
						}
					});
				}else{
				    res.json(myUtils.createQuickBloxError(err));
			   	}
			});
    	}else{
    		res.json(myUtils.createDatabaseError(err));
    	}
    });
};

function listMessage(req, res){
	var user_id 	= req.query.user_id,
		dialog_id   = req.query.dialog_id,
		page_size   = parseInt(req.query.page_size),
		page_number = parseInt(req.query.page_number);
 	var query_user 	= "SELECT " + constants.EMAIL + ", " + constants.PWD +
                  	  " FROM " + constants.CLIENT_USER +
                  	  " WHERE "  + constants.USER_ID + " = ?";
    dbConfig.query(query_user, [user_id], function(err, rows){
    	if(rows && rows.length > 0){
    		quickbloxConfig.createSession({email: rows[0].email, password: rows[0].pwd}, function(err, res) {
			  	if(res){
				    var skip = page_number*page_size,
				    	filters = {"chat_dialog_id": dialog_id, "sort_desc": "date_sent", "limit": page_size, "skip": skip};
					quickbloxConfig.chat.message.list(filters, function(err, message) {
						if(err){
						 	res.json(myUtils.createQuickBloxError(err));
						}else{
							console.log(message);	
						}
					});
				}else{
				    res.json(myUtils.createQuickBloxError(err));
			   	}
			});
    	}else{
    		res.json(myUtils.createDatabaseError(err));
    	}
    });
};

function createDialog(req, res){
	var dialogObject 	= req.swagger.params.dialog.value;
	var user_id 	 	= dialogObject.user_id,
		leader_id	 	= dialogObject.leader_id,
		dialog_id 	 	= dialogObject.dialog_id;
	var dialogStr 		= '{"'  + constants.USER_ID + '":"' + user_id + '", "'
	                     		+ constants.LEADER_ID + '":"' + leader_id + '", "' 
	                     		+ constants.DIALOG_ID + '":"' + dialog_id + '"}'; 
    var dialogObj 		=  JSON.parse(dialogStr);	
	var insert_dialog 	= "INSERT INTO " + constants.DIALOG + " SET ?",
		query 			= "SELECT * FROM " + constants.DIALOG + " WHERE " + constants.ID + " = ?";
	dbConfig.query(insert_dialog, dialogObj, function(err, rows){
		if(err){
			console.log(err);
			res.json(myUtils.createDatabaseError(err));
		}else{
			dbConfig.query(query, [rows.insertId], function(err, rows){
				if(err){
					res.json(myUtils.createDatabaseError(err));
				}else{					
					res.json({returnCode: constants.SUCCESS_CODE, message: "Create dialog with " + dialog_id + " successfully.", data : {dialog :rows[0]}});
				}
			});
		}
	});	
};