module.exports = function(service) {
	
	var Ship = service.useModel('Ship');
	
	
	var ShipUpdate = function(ship_id) {
		this.queryObject = Ship.findById(ship_id);
		this.add = [];
		this.remove = [];
	};
	
	ShipUpdate.prototype.getQueryObject = function() {
		return this.queryObject;
	};
	
	return ShipUpdate;
	
}