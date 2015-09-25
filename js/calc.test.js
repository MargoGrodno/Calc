var assert = require('assert');
var rpn = require('./calc');

describe('Test', function() {
    it('2+2 test', function () {
    	var result = rpn.calculator('2+2');

    	assert(result == 4);
    });
    it('2+9 test', function () {
    	var result = rpn.calculator('2+9');

    	assert(result == 11);
    });
    it('2+2*(5-3) test', function () {
    	var result = rpn.calculator('2+2*(5-3)');

    	assert(result == 6);
    });
});