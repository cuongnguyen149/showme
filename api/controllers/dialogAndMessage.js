'use strict';

var myUtils = require('../../utility/utils');
var dbConfig = require('../../config/dbConfig');
var constants = require('../../constants');
var quickbloxConfig = require('../../config/quickbloxConfig');
module.exports = {
	test: test
};

function test(req, res){
	var user = {
      id: 12135033,
      name: 'test1',
      email: 'cuong@a.com',
      pass: '123456SM'
    };
 
	quickbloxConfig.createSession({email: user.email, password: user.pass}, function(err, res) {
	  if (res) {
	    console.log(res);
	    var filters = null;
		quickbloxConfig.chat.dialog.list(filters, function(err, resDialogs) {
		  if (err) {
		    console.log(err);
		  } else {
		 	console.log(resDialogs);	
		  }
		});
	  }else{
	    console.log(err);
	  }
	});
};