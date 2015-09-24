var assert = require('assert');
var rpn = require('./calc');

describe('Reverse polish notation', function() {
    it('some dummi test', function () {
    	var result = rpn.preparationExpr('2+2');

    	assert(result != null);
    });
});