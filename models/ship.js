module.exports = function(db) {

    var util = require('util'),
        Avatar = require('../argie/models/avatar')(db, 'Ship'),
        MessageHolder = require('../argie/models/messageHolder')(db);

    Ship = function(doc) {
        Ship.super_.call(this, doc);

        if (doc) {

        }
        else {
            this.setNewMessageText('** New command added: %s **\n');
            // controls and crew members are child messageHolders
            var crew = new MessageHolder();
            var securityHolder = new MessageHolder();
            securityHolder.setNewMessageText('** New crew command added to crew->security: %s **\n');
            crew.addChild('security', securityHolder);
            var medicalHolder = new MessageHolder();
            medicalHolder.setNewMessageText('** New crew command added to crew->medical: %s **\n');
            crew.addChild('medical', medicalHolder);
            var empatHolder = new MessageHolder();
            empatHolder.setNewMessageText('** New crew command added to crew->empat: %s **\n');
            crew.addChild('empat', empatHolder);
            var engineeringHolder = new MessageHolder();
            engineeringHolder.setNewMessageText('** New crew command added to crew->engineering: %s **\n');
            crew.addChild('engineering', engineeringHolder);
            var culturalHolder = new MessageHolder();
            culturalHolder.setNewMessageText('** New crew command added to crew->cultural: %s **\n');
            crew.addChild('cultural', culturalHolder);
            var infoHolder = new MessageHolder();
            infoHolder.setNewMessageText('** New crew command added to crew->info: %s **\n');
            crew.addChild('info', infoHolder);
            this.addChild('crew', crew);

            var shipControls = new MessageHolder();
            var weaponHolder = new MessageHolder();
            weaponHolder.setNewMessageText('** New command added to ship_controls->weapons: %s **\n');
            shipControls.addChild('weapons', weaponHolder);
            var shieldHolder = new MessageHolder();
            shieldHolder.setNewMessageText('** New command added to ship_controls->shields: %s **\n');
            shipControls.addChild('shields', shieldHolder);
            var sensorHolder = new MessageHolder();
            sensorHolder.setNewMessageText('** New command added to ship_controls->sensors: %s **\n');
            shipControls.addChild('sensors', sensorHolder);
            var databankHolder = new MessageHolder();
            databankHolder.setNewMessageText('** New command added to ship_controls->databank: %s **\n')
            shipControls.addChild('databank', databankHolder);
            var processorHolder = new MessageHolder();
            processorHolder.setNewMessageText('** New command added to ship_controls->processor: %s **\n')
            shipControls.addChild('processor', processorHolder);
            this.addChild('ship_controls', shipControls);

            var dmHolder = new MessageHolder();
            dmHolder.setNewMessageText('** New Direct Message Received: %s **\n')
            this.addChild('direct_messages', dmHolder);
        }
    }
    util.inherits(Ship, Avatar);

    Ship.prototype.onSave = function(ship) {
        var doc = Ship.super_.prototype.onSave(ship);

        return doc;
    };

    db.register('Ship', Ship);

    return Ship;
}

