//shamelessly copied from https://github.com/dtryon/clog/blob/master/src/service.js
var environment;
var mongoose = require('mongoose');

module.exports.init = function(env, mongoose) {
    environment = env;
    mongoose = mongoose;
};

module.exports.useModel = function (modelName) {
    var checkConnectionExists = (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2);
    if(!checkConnectionExists)
        mongoose.connect(environment.db.URL);
    return require("./models/" + modelName)(mongoose);
};

//don't know if I'll ever use this:
/*
module.exports.useModule = function (moduleName) {
    return require("./modules/" + moduleName);
};
*/