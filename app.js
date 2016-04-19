'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express        = require('express');
var app            = express();
var constants      = require('./constants');
var appConfig      = require('./config/appConfig');
var myUtils        = require('./utility/utils');
module.exports     = app; // for testing

var config = {
  appRoot: __dirname // required config
};
app.use(express.static(__dirname + '/public'));
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if  (!req.originalUrl) {
    	res.setHeader('Content-Type', 'application/json');
		res.json(myUtils.createErrorStr(constants.BAD_PARAMETERS));
		return;
    }    
    //console.log(req.originalUrl + "  " + req.headers.token);
    if (req.originalUrl.indexOf("/login") >= 0 || req.originalUrl.indexOf("/user") >= 0 || req.originalUrl.indexOf("/doc/api") >= 0) {
		next();
	} else if (req.headers.token) {
		myUtils.validateToken(req, res, next);
	} else {
		// ignore
		// res.json(myUtils.createErrorStr('No token found', constants.NO_TOKEN_CODE));
		next();
	}
});
app.get('/doc/api', function(req, res){
	res.sendfile('public/index.html');
});
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || appConfig.app.port;
  app.listen(port, function(){
  	console.log("Server listening on port :" +  port);
  });
});