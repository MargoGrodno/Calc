var rpn = require('./calc');
var consoleReader = require('./consoleReader');

function defineVariableValue (variable, succeed, failure) {
    variable.value = 2;
    succeed(variable);
}


rpn.calculator('t+h', function(res) {
    console.log(res);
}, function(err) {
    console.log('fail');
    throw err;
}, defineVariableValue);


/*
var result = rpn.calculator('()');
console.log(result);
*/