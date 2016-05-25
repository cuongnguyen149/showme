'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var constants = require('../../constants');
module.exports = {
	listMerchangeType: listMerchangeType
}
function listMerchangeType (req, res){
	var query = " SELECT * FROM " + constants.MERCHANDISE_TYPE;
	dbConfig.query(query, function(err, rows){
		if(err){
			res.json(myUtils.createDatabaseError(err));
		}else{
			res.json({returnCode: constants.SUCCESS_CODE, message: "Get merchandise type success.", data : {merchandiseType :rows}});
		}
	});
}