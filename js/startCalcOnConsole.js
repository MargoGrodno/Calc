var rpn = require('./calc');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('Enter exprassion ');

rl.on('line', function(incomingStr) {
    rl.close();
    console.log('you say me calculate the next exprassion: ' + incomingStr)
    console.log(rpn.calculator(incomingStr));
});