var assert = require('assert');
var expect = require("chai").expect;
var embeddedMethods = require('./embeddedMethods');

describe('Math operations', function() {
	
	describe('sqrt', function() {
		it('4 --> 2', function () {
			var result = embeddedMethods.sqrt([4]);
			expect(result).to.equal(2);
		});
		it('49 --> 7', function () {
			var result = embeddedMethods.sqrt([49]);
			expect(result).to.equal(7);
		});
	});	
	
	describe('factorial', function() {
		it('4! --> 24', function () {
			var result = embeddedMethods.factorial([4]);
			expect(result).to.equal(24);
		});
		it('0! --> 1', function () {
			var result = embeddedMethods.factorial([0]);
			expect(result).to.equal(1);
		});
	});	

	describe('sum', function() {
		it('2,6 ---> 8', function () {
			var result = embeddedMethods.sum([2,6]);
			expect(result).to.equal(8);
		});
		it('2,-2,6,7,9,4.7,345,2,1,22,-11,74,34,25 ---> 518.7', function () {
			var result = embeddedMethods.sum([2,-2,6,7,9,4.7,345,2,1,5,6,74,34,25]);
			expect(result).to.equal(518.7);
		});
		it('Infinity,4 ---> Infinity', function () {
			var result = embeddedMethods.sum([Infinity,4]);
			expect(result).to.equal(Infinity);
		});
	});

	describe('arithmetic average', function() {
		it('2,2 ---> 2', function () {
			var result = embeddedMethods.arithmeticAverage([2,2]);
			expect(result).to.equal(2);
		});
		it('8,80,5 ---> 31', function () {
			var result = embeddedMethods.arithmeticAverage([8,80,5]);
			expect(result).to.equal(31);
		});
		it('2,-2,6,7,9,4.7,345,2,1,5,6,74,34,25 ---> 518.7/14', function () {
			var result = embeddedMethods.arithmeticAverage([2,-2,6,7,9,4.7,345,2,1,5,6,74,34,25]);
			expect(result).to.equal(518.7/14);
		});
		it('8,80,5,Infinity ---> Infinity', function () {
			var result = embeddedMethods.arithmeticAverage([8,80,5,Infinity]);
			expect(result).to.equal(Infinity);
		});
	});	

	describe('geometric average', function() {
		it('3,12 ---> 6', function () {
			var result = embeddedMethods.geometricAverage([3,12]);
			expect(result).to.equal(6);
		});
		it('30,100,45,6 ---> 30', function () {
			var result = embeddedMethods.geometricAverage([30,100,45,6]);
			expect(result).to.equal(30);
		});
	});

	describe('quadratic average', function() {
		it('1,3,5,7 ---> sqrt(22)', function () {
			var result = embeddedMethods.quadraticAverage([1,3,5,7]);
			expect(result).to.equal(Math.sqrt(21));
		});
		it('30,12,6 ---> 6 * sqrt(10)', function () {
			var result = embeddedMethods.quadraticAverage([30,12,6]);
			expect(result).to.equal(6*Math.sqrt(10));
		});
	});		
});