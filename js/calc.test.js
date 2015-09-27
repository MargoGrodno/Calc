var assert = require('assert');
var expect    = require("chai").expect;
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

    it('12+9 test', function () {
    	var result = rpn.calculator('12+9');
    	assert(result == 21);
    });
    it('14+22*(5-3) test', function () {
    	var result = rpn.calculator('14+22*(5-3)');
    	assert(result == 58);
    });
    it('14/7*6 test', function () {
        var result = rpn.calculator('14/7*6');
        assert(result == 12);
    });
    it('(6+8)/7*6 test', function () {
        var result = rpn.calculator('(6+8)/7*6');
        expect(result).to.equal(12);
    });
    it('1*0+0*1', function () {
        var result = rpn.calculator('1*0+0*1');
        expect(result).to.equal(0);
    });
    it('(14+22*((5-3))) test', function () {
        var result = rpn.calculator('(14+22*((5-3)))');
        assert(result == 58);
    });
    it('1*(0+1) test', function () {
        var result = rpn.calculator('1*(0+1)');
        expect(result).to.equal(1);
    });
    it('0+905 test', function () {
        var result = rpn.calculator('0+905');
        expect(result).to.equal(905);
    });
    it('1*(0+0+3+0)+90807 test', function () {
        var result = rpn.calculator('1*(0+0+3+0)+90807');
        expect(result).to.equal(90810);
    });
    it('33333333*2 test', function () {
        var result = rpn.calculator('33333333*2');
        expect(result).to.equal(66666666);
    });
     
});