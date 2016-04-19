function getLeaderInfo(req, res){
	var user_id = req.swagger.params.user_id.value;
	var query   = "SELECT *, NULL AS " + constants.PWD + 
	              " FROM " + constants.CLIENT_USER +
	              " WHERE "  + constants.USER_ID + " = "  + user_id;
	dbConfig.query(query, function(err, rows){
		if(rows && rows.length > 0){
			res.json({returnCode: constants.SUCCESS_CODE, message: "Get information of leader success.", data: {user: rows[0]}});
		}else if(err){
			res.json(myUtils.createDatabaseError(err));
		}else{
			res.json(myUtils.createErrorStr("user_id: " +  user_id + " does not exist!", constants.ERROR_CODE));
		}
	});             
};

function updateLocation(req, res){
	var user_id = req.swagger.params.user_id.value,
		address = req.swagger.params.address.value;
	geocoder.geocode(address)
	    .then(function(resuls) {
	        if(resuls && resuls.length > 0){
        		var update = "UPDATE " + constants.CLIENT_USER +
				          	 " SET " + constants.LATITUDE + " = " + resuls[0].latitude + ", " 
				          	 		 + constants.LONGITUDE + " = " + resuls[0].longitude +
				          	 " WHERE " + constants.USER_ID + " = "  + user_id;
				var query = "SELECT *, NULL AS " + constants.PWD + 
			                          " FROM " + constants.CLIENT_USER +
			                          " WHERE "  + constants.USER_ID + " = "  + user_id;          	 
				dbConfig.query(update, function(err, rows){
					if(rows){
						dbConfig.query(query, function(err, rows){
							if(rows){
								res.json({returnCode: constants.SUCCESS_CODE, message: "Updated location of leader " + user_id + " to " + address + ".", data: {user: rows[0]}});	
							}else{
								res.json(myUtils.createDatabaseError(err)); 
							}
						});
						
					}else{
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

function leaderLocation(req, res){
	var radius 	= parseFloat(req.query.radius),
		lat 	= parseFloat(req.query.lat),
		lng 	= parseFloat(req.query.lng),
		address = req.query.address;
	geocoder.geocode(address)
	    .then(function(resuls) {
	    	if(resuls && resuls.length > 0){
	    		lat = resuls[0].latitude;
	    		lng = resuls[0].lng;
	    		var query = "SELECT " + constants.USER_ID + ", " + constants.LATITUDE + ", " + constants.LONGITUDE + 
							", ( 6371 * acos( cos( radians(" + lat + ") ) * cos( radians( "+  constants.LATITUDE + " ) ) * cos( radians( " + constants.LONGITUDE + " ) - radians( " + lng + " ) ) + sin( radians( " + lat + " ) ) * sin(radians( "+ constants.LATITUDE + " )) ) ) AS distance " +
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
	    	}else{
	    		res.json(myUtils.createErrorStr("Your input address does not exist! Please try again.", constants.ERROR_CODE));
	    	}
	    })
	    .catch(function(err) {
	        res.json(myUtils.createErrorStr(err, constants.ERROR_CODE));
	    }); 			
};