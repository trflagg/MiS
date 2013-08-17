
var firstMessage = 'INIT';


var environment = require('./environment-dev'),
    readline = require('readline'),
    Db = require('./argie/db');

function start() {

    console.log('Creating ship');
    // ship is global
    ship = db.create('Ship');
    console.log(ship);

    db.load('Message', {name: firstMessage}, function(err, message) {
        if (err) {
            console.log(err);
        }
        end();
        // doLoop(message);
    })
}


function doLoop(message) {
    if (message) {
        var result = message.run(ship, function(err, result) {
            
            // show result of message
            console.log(result);

            //show command options
            promptForCommands();
        });
    }
}

function promptForCommands() {
    var commands = avatar.getCommandTextList();
    var commandlength = commands.length;
    for (var i=0; i<commandlength; i++) {
        console.log(i + ') ' + commands[i]);
    }
    rl.question('>', function(answer) {
        if (answer == 'q') {
            end();
        }
        else {
            var a = parseInt(answer, 10);
            if (a > commandlength || a < 0) {
                promptForCommands();
            }
            else {
                // run message, show result, ask for next command
                console.log(a);
                var result = ship.runMessage(ship.getCommandTextList()[a], function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                    promptForCommands();
                });
            }
        }

    });
}


function end() {
    db.close();
    rl.close();
}

module.exports = function() {

    // db and rl are global
    db = new Db(environment),
    rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt('>');

    require('./models')(db);

    console.log('Welcome!');

    start();
}();