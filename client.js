
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
            promptOptions(ship.getCommandTextList(), '');
        });
    }
}


function promptOptions(options, currentChoice) {

    // console.log(options);
    // console.log(currentChoice);

    var currentOptions = options;
    if (currentChoice != '') {
        var choices = currentChoice.split('.');
        // console.log(choices);

        for (var i=0, ll=choices.length; i<ll; i++) {

            if (currentOptions[choices[i]].children) {
                currentOptions = currentOptions[choices[i]].children;
                // console.log(currentOptions);
            }
            else {
                var childString = makeChildString(options, choices)
                // console.log('cs'+childString);
                var result = ship.runMessage(currentOptions[choices[i]].text, childString, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                    promptOptions(ship.getCommandTextList(), '');
                });
                return;
            }
        }

    }

    var optionString = getStringArray(currentOptions);
    // console.log(optionString);

    var result = '';
    for (var i = 0, length = optionString.length; i<length; i++) {
       result = result + i + ') ' + optionString[i] + '\n';
    }
    if (optionString.length === 0) {
        result = result + 'No options available.' + '\n';
    }
    result = result + '' + '\n';
    if (currentChoice != '') {
        result = result + 'b) back' + '\n';
    }
    console.log(result);
    rl.question('>', function(answer) {
        console.log('====================================');
        console.log('');
        if (answer === 'b') {
            promptOptions(options, currentChoice.split('.').slice(0,-1).join('.'));
        }
        else if (!handleOptions(answer)) {
            console.log('');
            currentChoice = addChoice(currentChoice, answer);

            promptOptions(options, currentChoice);
        }
    });
}

function makeChildString(options, choices) {
    var childString = '';
    var currentOptions = options;
    for (var i=0, ll=choices.length; i<ll-1; i++) {
        childString = addChoice(childString, currentOptions[choices[i]].text);
        currentOptions = currentOptions[choices[i]].children;
    }
    return childString;
}

function addChoice(currentChoice, newChoice) {
    if (currentChoice != '') {
        currentChoice = currentChoice + '.' + newChoice;
    }
    else {
        currentChoice = newChoice;
    }

    return currentChoice;
}


// options are either array of strings or object
// [ { crew: [ [Object], [Object], [Object], [Object], [Object], [Object] ] },
//   { commands: [ [Object], [Object], [Object], [Object], [Object] ] },
//   { direct_messages: [ 'Guard orders' ] } ]
function getStringArray(options) {
    var option_string_array = [];
    for (var i=0, ll=options.length; i<ll; i++) {
        var childCount = options[i].childMessageCount;
        var str = '  ';
        if (childCount !== undefined) {
            if (childCount > 0) {
                str = options[i].text + ' (' + childCount + ')';
            }
        }
        else {
            str = options[i].text;
        }
        option_string_array.push(str);
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