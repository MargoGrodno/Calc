var utils = require('./utils');

function createRL () {
	var readline = require('readline');
	var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    return rl;
}

function takeVariableValue(variableName, continueWith) {
    var rl = createRL();

    console.log('Enter value for variable ' + variableName);

    rl.on('line', function(incomingStr) {
        if (utils.isStrIsNumber(incomingStr)) {
            rl.close();
            console.log('now '+ variableName + ' = ' + incomingStr);
            continueWith(Number(incomingStr));
        } else {
            console.log(incomingStr + ' is not a number');
        }
    });
};


module.exports = {
	takeVariableValue:takeVariableValue,
    createRL: createRL
};


