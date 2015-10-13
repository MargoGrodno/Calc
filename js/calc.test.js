var assert = require('assert');
var expect    = require("chai").expect;
var rpn = require('./calc');


describe('Calculation using Reverse Polish Notation', function() {
	
	describe('General expressions', function() {
		it('2+2 ---> 4', function () {
			var result = rpn.calculator('2+2');
			expect(result).to.equal(4);
		});
		it('2+9 ---> 11', function () {
			var result = rpn.calculator('2+9');
			expect(result).to.equal(11);
		});
		it('12+9 ---> 21', function () {
			var result = rpn.calculator('12+9');
			expect(result).to.equal(21);
		});
		it('14+22*(5-3) ---> 58', function () {
			var result = rpn.calculator('14+22*(5-3)');
			expect(result).to.equal(58);
		});
		it('14/7*6 ---> 12', function () {
			var result = rpn.calculator('14/7*6');
			expect(result).to.equal(12);
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
			expect(result).to.equal(58);
		});
		it('1*(0+0+3+0)+90807 ---> 90810', function () {
			var result = rpn.calculator('1*(0+0+3+0)+90807');
			expect(result).to.equal(90810);
		});
		it('33/0 ---> Infinity', function () {
			var result = rpn.calculator('33/0');
			expect(result).to.equal(Infinity);
		});
		it('0/600 ---> 0', function () {
			var result = rpn.calculator('0/600');
			expect(result).to.equal(0);
		});
	});


	describe('Unary minus', function() {
		it('-1 ---> -1', function () {
			var result = rpn.calculator('-1');
			expect(result).to.equal(-1);
		});
		it('-1-2 ---> -3', function () {
			var result = rpn.calculator('-1-2');
			expect(result).to.equal(-3);
		});
		it('-(-(1-2)) ---> -1', function () {
			var result = rpn.calculator('-(-(1-2))');
			expect(result).to.equal(-1);
		});
		it('56-(-(1-2)+2) ---> 53', function () {
			var result = rpn.calculator('56-(-(1-2)+2)');
			expect(result).to.equal(53);
		});
		it('-(1-2)*(5+6/(3-2)) ---> 11', function () {
			var result = rpn.calculator('-(1-2)*(5+6/(3-2))');
			expect(result).to.equal(11);
		});
	});
	
	describe('Variables', function() {
		it('t+1 ---> 3', function () {
			var result = rpn.calculator('t+1');
			expect(result).to.equal(3);
		});
		it('t+h ---> 4', function () {
			var result = rpn.calculator('t+h');
			expect(result).to.equal(4);
		});
		it('var-(-(1-var1)+var2) ---> -1', function () {
			var result = rpn.calculator('var-(-(1-var1)+var2)');
			expect(result).to.equal(-1);
		});
	});
	
	describe('Embedded Methods', function() {
		it('sum(2,3,4,1,1,1) ---> 12', function () {
			var result = rpn.calculator('sum(2,3,4,1,1,1)');
			expect(result).to.equal(12);
		});
		it('10-sum(2) ---> 8', function () {
			var result = rpn.calculator('10-sum(2)');
			expect(result).to.equal(8);
		});
		it('sum(2,13-2*5) ---> 5', function () {
			var result = rpn.calculator('sum(2,13-2*5)');
			expect(result).to.equal(5);
		});
		it('-sum(2,5,4) ---> -11', function () {
			var result = rpn.calculator('-sum(2,5,4)');
			expect(result).to.equal(-11);
		});
		it('sum(5,sum(6,5),8,sum(4,sum(3,7),5)) ---> 43', function () {
			var result = rpn.calculator('sum(5,sum(6,5),8,sum(4,sum(3,7),5))');
			expect(result).to.equal(43);
		});
		it('aaverage(5,7,9)+factorial(4)+(gaverage(6,24)+6)/(5+mult(1,2*2)) ---> 33', function () {
			var result = rpn.calculator('aaverage(5,7,9)+factorial(4)+(gaverage(6,24)+6)/(5+mult(1,2*2))');
			expect(result).to.equal(33);
		});
	});
	
	describe('Embedded Methods & Variables', function() {
		it('10-sum(var,1) ---> 7', function () {
			var result = rpn.calculator('10-sum(var,1)');
			expect(result).to.equal(7);
		});
		it('sum(2,13-var*5) ---> 5', function () {
			var result = rpn.calculator('sum(2,13-var*5)');
			expect(result).to.equal(5);
		});
	});
	

	describe('Errors', function() {
		it('() ---> incorrect expression', function () {
			expect(function() {rpn.calculator('()');}).to.throw('incorrect expression');
		});
		it('(2-3)) ---> incorrect expression: brackets error', function () {
			expect(function() {rpn.calculator('(2-3))');}).to.throw('incorrect expression: brackets error');
		});
		it(')(2-3 ---> incorrect expression: brackets error', function () {
			expect(function() {rpn.calculator('(2-3))');}).to.throw('incorrect expression: brackets error');
		});
		it('*-/ ---> incorrect expression', function () {
			expect(function() {rpn.calculator('*-/');}).to.throw('incorrect expression');
		});
		it('*2+87 ---> incorrect expression', function () {
			expect(function() {rpn.calculator('*2+87');}).to.throw('incorrect expression');
		});
		it('2++87 ---> incorrect expression', function () {
			expect(function() {rpn.calculator('2++87');}).to.throw('incorrect expression');
		});
		it('3+87- ---> incorrect expression', function () {
			expect(function() {rpn.calculator('3+87-');}).to.throw('incorrect expression');
		});
		it('3%87- ---> incorrect expression', function () {
			expect(function() {rpn.calculator('3%87');}).to.throw('incorrect expression');
		});
		it('(test)- ---> incorrect expression', function () {
			expect(function() {rpn.calculator('(test)-');}).to.throw('incorrect expression');
		});
		it('sum(2,,13-var*5) ---> incorrect expression', function () {
			expect(function() {rpn.calculator('sum(2,,13-var*5)');}).to.throw('incorrect expression');
		});
		it('sqrt+5 ---> incorrect use of embedded method', function () {
			expect(function() {rpn.calculator('sqrt+5');}).to.throw('incorrect use of embedded method');
		});
		it('sqrt(4+5 ---> incorrect use of embedded method', function () {
			expect(function() {rpn.calculator('sqrt(4+5');}).to.throw('incorrect use of embedded method');
		});
	});
	
	describe('tests for develop', function() {
		
		it('sqrt4+5 ---> 7', function () {
			var result = rpn.calculator('sqrt4+5');
			expect(result).to.equal(7);
		});
	})
	
});
