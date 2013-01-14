//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/service.js
var environment;
var mongoose = require('mongoose');

module.exports.init = function(env, mongoose) {
    environment = env;
    mongoose = mongoose;
};

module.exports.getMongoose = function() {
	return mongoose;
};

module.exports.useModel = function (modelName) {
    var checkConnectionExists = (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2);
    if(!checkConnectionExists)
        mongoose.connect(environment.db.URL);
    return mongoose.model(modelName);
};