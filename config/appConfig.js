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
	// braintree: {
	// 	merchantId: "bsk2xwy7bnbk8qbc",
	// 	publicKey: "ndjx6nmm5x4yz2nm",
	// 	privateKey: "a288d14b567f8bb2e79b5418eadb98de"
	// },
	// googleCloudMessage : {
	// 	api_key: "AIzaSyBuICziu7cttbRYS9z_MmFXU5plz9hjk0g"
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
		merchantId: "bsk2xwy7bnbk8qbc",
		publicKey: "ndjx6nmm5x4yz2nm",
		privateKey: "a288d14b567f8bb2e79b5418eadb98de"
	},
	googleCloudMessage : {
		api_key: "AIzaSyBuICziu7cttbRYS9z_MmFXU5plz9hjk0g"
	},
	app : {
		port: 9001
	}

	/*
	* END for develop environment.
	*/
};
module.exports = Configuration;