'use strict';

var Configuration = {
	/*
	* For production environment.
	*/
	// mysql : {
	// 	host: 'localhost',
	// 	user: 'root',
	// 	password: 'P@ssword123',
	// 	dateStrings:true,
	// 	database: 'showme_db'
	// },
	// quickblox : {
	// 	appID : '38631',
	// 	authKey: 'Jk4b5XEEbBPKTqu',
	// 	athuSecret: 'fVMmMrwjMeUAFUX'
	// },
	// app : {
	// 	port: 80
	// }
	/*
	* END for production environment.
	*/


	/*
	* For develop environment.
	*/

	mysql : {
		host: 'localhost',
		user: 'root',
		password: 'P@ssword123',
		dateStrings:true,
		database: 'showme_db_dev'
	},
	quickblox : {
		appID : '40477',
		authKey: '5S8UfxMNSk32XWO',
		athuSecret: 'kCXreDY7YDZJm5T'
	},
	braintree: {
		merchantId: "mz2bc32xgysywsjw",
		publicKey: "3bf78x8d4p8t6h7n",
		privateKey: "3fb0b53e32211e34b709a093a9400f6d"
	},
	app : {
		port: 9001
	}

	/*
	* END for develop environment.
	*/
};
module.exports = Configuration;