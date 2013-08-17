//define the models

module.exports = function(db) {
    require('./argie/models/message')(db);
	
    require('./models/ship')(db);
};