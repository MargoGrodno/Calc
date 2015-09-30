var assert = require('assert');
var expect    = require("chai").expect;
var rpn = require('./calc');

describe('Math operations', function() {
	describe('sum', function() {
		it('2,6 ---> 8', function () {
			var result = rpn.sum(2,6);

			assert(result == 8);
		});
		it('2,-2,6,7,9,4.7,345,2,1,22,-11,74,34,25 ---> 518.7', function () {
			var result = rpn.sum(2,-2,6,7,9,4.7,345,2,1,5,6,74,34,25);

			assert(result == 518.7);
		});
		it('Infinity,4 ---> NaN', function () {
			var result = rpn.arithmeticAverage(Infinity,4);

			expect(result).to.equal(Infinity);
		});
	});	
	describe('arithmetic awerage', function() {
		it('2,2 ---> 2', function () {
			var result = rpn.arithmeticAverage(2,2);

			assert(result == 2);
		});
		it('8,80,5 ---> 31', function () {
			var result = rpn.arithmeticAverage(8,80,5);

			assert(result == 31);
		});
		it('2,-2,6,7,9,4.7,345,2,1,5,6,74,34,25 ---> 518.7/14', function () {
			var result = rpn.arithmeticAverage(2,-2,6,7,9,4.7,345,2,1,5,6,74,34,25);

			assert(result == 518.7/14);
		});
		it('8,80,5,Infinity ---> Infinity', function () {
			var result = rpn.arithmeticAverage(8,80,5,Infinity);

			expect(result).to.equal(Infinity);
		});
	});	
});
describe('Reverse Polish Notation', function() {
	describe('from expression', function() {
		it('2+2 ---> 4', function () {
			var result = rpn.calculateRpn([2, 2, '+']);

			assert(result == 4);
		});
		it('0/600 ---> 0', function () {
			var result = rpn.calculateRpn([0, 600, '/']);

			expect(result).to.equal(0);
		});
		it('(600/0)+2 ---> Infinity', function () {
			var result = rpn.calculateRpn([600, 0, '/', 2, '+']);

			expect(result).to.equal(Infinity);
		});
	});
	describe('from string', function() {
		it('2+2 ---> 4', function () {
			var result = rpn.calculator('2+2');
			assert(result == 4);
		});
		it('2+9 ---> 11', function () {
			var result = rpn.calculator('2+9');
			assert(result == 11);
		});
		it('12+9 ---> 21', function () {
			var result = rpn.calculator('12+9');
			assert(result == 21);
		});
		it('12-9 ---> 3', function () {
			var result = rpn.calculator('12-9');
			assert(result == 3);
		});
		it('14+22*(5-3) ---> 58', function () {
			var result = rpn.calculator('14+22*(5-3)');
			assert(result == 58);
		});
		it('14/7*6 ---> 12', function () {
			var result = rpn.calculator('14/7*6');
			assert(result == 12);
		});
		it('(6+8)/7*6 ---> 12', function () {
			var result = rpn.calculator('(6+8)/7*6');
			expect(result).to.equal(12);
		});
		it('1*0+0*1 ---> 0', function () {
			var result = rpn.calculator('1*0+0*1');
			expect(result).to.equal(0);
		});
		it('(14+22*((5-3))) ---> 85', function () {
			var result = rpn.calculator('(14+22*((5-3)))');
			assert(result == 58);
		});
		it('1*(0+1) ---> 1', function () {
			var result = rpn.calculator('1*(0+1)');
			expect(result).to.equal(1);
		});
		it('1*(0+0+3+0)+90807 ---> 90810', function () {
			var result = rpn.calculator('1*(0+0+3+0)+90807');
			expect(result).to.equal(90810);
		});
		it('33333333*2 ---> 66666666', function () {
			var result = rpn.calculator('33333333*2');
			expect(result).to.equal(66666666);
		});
		it('33/0 ---> Infinity', function () {
			var result = rpn.calculator('33/0');
			expect(result).to.equal(Infinity);
		});
		it('0/600 ---> 0', function () {
			var result = rpn.calculator('0/600');
			expect(result).to.equal(0);
		});
		it('(0-83)*11 ---> -913', function () {
			var result = rpn.calculator('(0-83)*11');
			expect(result).to.equal(-913);
		});
	});
	describe('unary minus', function() {
		it('-1 ---> -1', function () {
			var result = rpn.calculator('-1');
			expect(result).to.equal(-1);
		});
		it('-1-2 ---> -3', function () {
			var result = rpn.calculator('-1-2');
			expect(result).to.equal(-3);
		});
		it('-(1-2) ---> 1', function () {
			var result = rpn.calculator('-(1-2)');
			expect(result).to.equal(1);
		});
		it('-(1-2)*(5+6/(3-2)) ---> 11', function () {
			var result = rpn.calculator('-(1-2)*(5+6/(3-2))');
			expect(result).to.equal(11);
		});
	});
	
});