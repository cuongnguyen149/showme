var config     = require('./appConfig');
var mysql      = require('mysql');

var dbConnection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

module.exports = dbConnection;