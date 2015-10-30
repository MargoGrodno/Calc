var rpn = require('./calc');
var consoleReader = require('./consoleReader');

var rl = consoleReader.createRL();

console.log('Enter exprassion ');

rl.on('line', function(incomingStr) {
    rl.close();
    console.log('you say me calculate the next exprassion: ' + incomingStr)
    console.log(rpn.calculator(incomingStr));
});