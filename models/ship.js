module.exports = function(db) {

    var util = require('util'),
        Avatar = require('../argie/models/avatar')(db, 'Ship'),
        MessageHolder = require('../argie/models/messageHolder')(db);

    Ship = function(doc) {
        Ship.super_.call(this, doc);

        if (doc) {

        }
        else {
            // controls and crew members are child messageHolders
            var crew = new MessageHolder();
            crew.addChild('security', new MessageHolder());
            crew.addChild('medical', new MessageHolder());
            crew.addChild('empat', new MessageHolder());
            crew.addChild('engineering', new MessageHolder());
            crew.addChild('cultural', new MessageHolder());
            crew.addChild('info', new MessageHolder());
            this.addChild('crew', crew);

            var commands = new MessageHolder();
            commands.addChild('weapons', new MessageHolder());
            commands.addChild('shields', new MessageHolder());
            commands.addChild('sensors', new MessageHolder());
            commands.addChild('databank', new MessageHolder());
            commands.addChild('processor', new MessageHolder());
            this.addChild('commands', commands);

            this.addChild('direct_messages', new MessageHolder());
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

