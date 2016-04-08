var config     = require('./configuration');
var mysql      = require('mysql');

var dbConnection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password
});

module.exports = dbConnection;