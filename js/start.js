var rpn = require('./calc');
var consoleReader = require('./consoleReader');

function defineVariableValue (variable, succeed, failure) {
    variable.value = 2;
    succeed(variable);
}

function startAsync(str){
	rpn.calculator(str, function(res) {
	    console.log(res);
	}, function(err) {
	    console.log('fail');
	    throw err;
	}, defineVariableValue);
}

function startSync (str) {
	var result = rpn.calculator('str');
	console.log(result);
}

startAsync('2+3');
/*
var result = rpn.calculator('()');
console.log(result);
*/