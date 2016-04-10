var quickBlox = require('quickblox');
var config     = require('./appConfig');
quickBlox.init( config.quickblox.appID,
 				config.quickblox.authKey,
 				config.quickblox.athuSecret );
module.exports = quickBlox;