'use strict';
var util = require('util');
var config = require('../../config/appConfig');
var dbConfig = require('../../config/dbConfig');
var quickbloxConfig = require('../../config/quickbloxConfig');
module.exports = {
  registerUser: registerUser
};

function registerUser(req, res) {
  // dbConfig.connect(function(err) {
  //   if (err) {
  //     console.error('error connecting: ' + err.stack);
  //     return;
  //   }
   
  //   console.log('connected as id ' + dbConfig.threadId);
  // });
  // console.log(req.swagger.params.user.schema.schema);
  // console.log(req.swagger.params.user.value)
  var userObject = req.swagger.params.user.value;
  var params = {email : userObject.email, password: userObject.pwd};
  // var params = { 'email': "e@e.com", 'password': "somepass"};
  // console.log(userObject);
  // console.log(params);
  quickbloxConfig.createSession(function(err, result) {
    if(err){
      res.json(err);
    }else{
      // console.log(result);
      quickbloxConfig.users.create(params, function(err, result) {
        // console.log(result);
        if(err){
          res.json(err); 
        }else{
          if(result){
            dbConfig.connect(function(err) {
              if(err){
                console.log(err);
              }else{
                var query = "INSERT INTO client_user " + 
                            "(user_id, email, pwd) " +
                            "VALUES " +
                            "( "+ result.id + ", '"+ userObject.email + "', " +  '"+ userObject.pwd + "' +  ");";
                dbConfig.query(query, function(err, rows){
                   if(err){
                    console.log(err);
                   }else{
                    console.log(rows);
                   } 
                });            
              }
            });  
          }else{

          }
        }
      });  
    }    
  });
}
