var rpn = require('./calc');
var consoleReader = require('./consoleReader');
var rl = consoleReader.createRL();


console.log('Enter expression ');

rl.on('line', function(incomingStr) {
    rl.close();
    console.log('you say me calculate the next expression: ' + incomingStr)
    var result;
	rpn.calculator( incomingStr, function(res) {
	    console.log(incomingStr + " = " + res);
	}, function(err) {
	    console.log('fail');
	    throw err;
	}, consoleReader.defineVariableValue);
});