//define the models in mongoose
var fs = require('fs');

module.exports = function(mongoose) {
	require('./models/crewCommand')(mongoose);
	require('./models/directMessage')(mongoose);
	require('./models/game')(mongoose);
	require('./models/ship')(mongoose);
	require('./models/location')(mongoose);
	require('./models/message')(mongoose);
	require('./models/quest')(mongoose);
	require('./models/shipCommand')(mongoose);
	require('./models/system')(mongoose);
};