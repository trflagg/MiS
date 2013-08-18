
var firstMessage = 'INIT';


var environment = require('./environment-dev'),
    readline = require('readline'),
    Db = require('./argie/db');

function start() {

    // ship is global
    ship = db.create('Ship');

    db.load('Message', {name: firstMessage}, function(err, message) {
        if (err) {
            console.log("ERROR in start:" + err);
        }
        // end();
        doLoop(message);
    })
}


function doLoop(message) {
    if (message) {
        var result = message.run(ship, function(err, result) {
            
            // show result of message
            console.log(result);

            //show command options
            promptOptions(ship.getCommandTextList());
        });
    }
}


function promptOptions(options) {

    var length = options.length;

    var string_array = processOptionArray(options);

    for (var i = 0, length = string_array.length; i<length; i++) {
       console.log(i + ')' + string_array[i]);
    }

    rl.question('>', function(answer) {
        var num = parseInt(answer, 10);

        if (num < length || num > 0) {
            // child
            if (options[num].children) {
                promptOptions(options[num].children);
            }
            // message
            else {
                // run message, show result, ask for next command
                var result = ship.runMessage(ship.getCommandTextList()[num], function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                    promptOptions(ship.getCommandTextList());
                });
            };
        }
        else {
            if (!handleOptions(answer)) {
                console.log('');
                promptOptions(options);
            }
        }
    });
}

// options are either array of strings or object
// [ { crew: [ [Object], [Object], [Object], [Object], [Object], [Object] ] },
//   { commands: [ [Object], [Object], [Object], [Object], [Object] ] },
//   { direct_messages: [ 'Guard orders' ] } ]
function processOptionArray(options) {
    var option_string_array = [];
    for (var i=0, ll=options.length; i<ll; i++) {
        option_string_array.push(options[i].text);
    }

    return option_string_array;
}

function handleOptions(answer) {
    if (answer == 'q') {
        end();
        return true;
    }

    return false;
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

    console.log('Welcome to MiS!');

    start();
}();