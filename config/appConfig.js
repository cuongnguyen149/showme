'use strict';

var Configuration = {
	mysql : {
		host: 'localhost',
		user: 'root',
		password: 'P@ssword123',
		dateStrings:true,
		database: 'showme_db'
	},
	quickblox : {
		appID : '38631',
		authKey: 'Jk4b5XEEbBPKTqu',
		athuSecret: 'fVMmMrwjMeUAFUX'
	},
	// quickblox : {
	// 	appID : '37722',
	// 	authKey: '7dM2BUhuP3QzPD4',
	// 	athuSecret: 'QmQsmLMHNU252me'
	// },
	app : {
		port: 80
	}
};
module.exports = Configuration;