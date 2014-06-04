module.exports = function(db) {

    var util = require('util'),
        Avatar = require('argie/models/avatar')(db, 'Ship'),
        MessageHolder = require('argie/models/messageHolder')(db);

    Ship = function(doc) {
        Ship.super_.call(this, doc);

        if (doc) {
            this._shipName = doc.shipName;
            this._output = doc.output; 

        }
        else {
            this._output = "";

            this.setNewMessageText('** New command added: %s **');
            // controls and crew members are child messageHolders
            var crew = new MessageHolder();
            var securityHolder = new MessageHolder();
            securityHolder.setNewMessageText('** New crew command added to crew->security: %s **');
            crew.addChild('security', securityHolder);
            var medicalHolder = new MessageHolder();
            medicalHolder.setNewMessageText('** New crew command added to crew->medical: %s **');
            crew.addChild('medical', medicalHolder);
            var empatHolder = new MessageHolder();
            empatHolder.setNewMessageText('** New crew command added to crew->empat: %s **');
            crew.addChild('empat', empatHolder);
            var engineeringHolder = new MessageHolder();
            engineeringHolder.setNewMessageText('** New crew command added to crew->engineering: %s **');
            crew.addChild('engineering', engineeringHolder);
            var culturalHolder = new MessageHolder();
            culturalHolder.setNewMessageText('** New crew command added to crew->cultural: %s **');
            crew.addChild('cultural', culturalHolder);
            var infoHolder = new MessageHolder();
            infoHolder.setNewMessageText('** New crew command added to crew->info: %s **');
            crew.addChild('info', infoHolder);
            this.addChild('crew', crew);

            var shipControls = new MessageHolder();
            var weaponHolder = new MessageHolder();
            weaponHolder.setNewMessageText('** New command added to ship_controls->weapons: %s **');
            shipControls.addChild('weapons', weaponHolder);
            var shieldHolder = new MessageHolder();
            shieldHolder.setNewMessageText('** New command added to ship_controls->shields: %s **');
            shipControls.addChild('shields', shieldHolder);
            var sensorHolder = new MessageHolder();
            sensorHolder.setNewMessageText('** New command added to ship_controls->sensors: %s **');
            shipControls.addChild('sensors', sensorHolder);
            var databankHolder = new MessageHolder();
            databankHolder.setNewMessageText('** New command added to ship_controls->databank: %s **')
            shipControls.addChild('databank', databankHolder);
            var processorHolder = new MessageHolder();
            processorHolder.setNewMessageText('** New command added to ship_controls->processor: %s **')
            shipControls.addChild('processor', processorHolder);
            var enginesHolder = new MessageHolder();
            enginesHolder.setNewMessageText('** New command added to ship_controls->engines: %s **')
            shipControls.addChild('engines', enginesHolder);
            this.addChild('ship_controls', shipControls);

            var dmHolder = new MessageHolder();
            dmHolder.setNewMessageText('** New Direct Message Received: %s **')
            this.addChild('direct_messages', dmHolder);
        }
    }
    util.inherits(Ship, Avatar);

    Ship.prototype.onSave = function(ship) {
        var doc = Ship.super_.prototype.onSave(ship);
        doc.shipName = ship._shipName;
        doc.output = ship._output;

        return doc;
    };

    Ship.prototype.getShipName = function() {
        return this._shipName;
    };
    Ship.prototype.setShipName = function(shipName) {
        this._shipName = shipName;
    };

    Ship.prototype.appendOutput = function(output) {
        this._output += output;
    };
    Ship.prototype.getOutput = function() {
        return this._output
    };

    db.register('Ship', Ship);

    return Ship;
}

