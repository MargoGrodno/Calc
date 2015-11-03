var assert = require('assert');
var expect = require("chai").expect;
var rpn = require('./calc');

function defineVariableValue (variable, succeed, failure) {
    variable.value = 2;
    succeed(variable);
}

function failure (er) {
    console.log(er);
}

describe('Calculation using Reverse Polish Notation', function() {

    describe('Asynchronous call', function() {

        describe('General expressions', function() {

            it('12+9 ---> 21', function(done) {
                rpn.calculator('12+9', function(res) {
                    done();
                    expect(res).to.equal(21);
                }, failure, defineVariableValue);
            });
            it('(6+8)/7*6 ---> 12', function(done) {
                rpn.calculator('(6+8)/7*6', function(res) {
                    done();
                    expect(res).to.equal(12);
                }, failure, defineVariableValue);
            });
            it('(14+22*((5-3+1*0+0*1))) ---> 58', function(done) {
                rpn.calculator('(14+22*((5-3+1*0+0*1)))', function(res) {
                    done();
                    expect(res).to.equal(58);
                }, failure, defineVariableValue);
            });
            it('1*(0+0+3+0)+90807 ---> 90810', function(done) {
                rpn.calculator('1*(0+0+3+0)+90807', function(res) {
                    done();
                    expect(res).to.equal(90810);
                }, failure, defineVariableValue);
            });
            it('33/0 ---> Infinity', function(done) {
                rpn.calculator('33/0', function(res) {
                    done();
                    expect(res).to.equal(Infinity);
                }, failure, defineVariableValue);
            });
        });

        describe('Unary minus', function() {
            it('56-(-(1-2)+2) -----> 53', function(done) {
                rpn.calculator('56-(-(1-2)+2)', function(res) {
                    done();
                    expect(res).to.equal(53);
                }, failure, defineVariableValue);
            });
        });

        describe('Variables', function() {
            it('t+h -----> 4', function(done) {
                rpn.calculator('t+h', function(res) {
                    done();
                    expect(res).to.equal(4);
                }, failure, defineVariableValue);
            });
            it('djfh+1 -----> 3', function(done) {
                rpn.calculator('djfh+1', function(res) {
                    done();
                    expect(res).to.equal(3);
                }, failure, defineVariableValue);
            });
            it('var-(-(1-var1)+var2) -----> -1', function(done) {
                rpn.calculator('var-(-(1-var1)+var2)', function(res) {
                    done();
                    expect(res).to.equal(-1);
                }, failure, defineVariableValue);
            });
        });

        describe('Embedded Methods', function() {
            it('sum(5,sum(6,5),8,sum(4,sum(3,7),5)) -----> 43', function(done) {
                rpn.calculator('sum(5,sum(6,5),8,sum(4,sum(3,7),5))', function(res) {
                    done();
                    expect(res).to.equal(43);
                }, failure, defineVariableValue);
            });
            it('aaverage(5,7,9)+factorial(4)+(gaverage(6,24)+6)/(5+mult(1,2*2)) -----> 33', function(done) {
                rpn.calculator('aaverage(5,7,9)+factorial(4)+(gaverage(6,24)+6)/(5+mult(1,2*2))', function(res) {
                    done();
                    expect(res).to.equal(33);
                }, failure, defineVariableValue);
            });

        });

        describe('Embedded Methods & Variables', function() {
            it('sum(2,13-var*5) -----> 5', function(done) {
                rpn.calculator('sum(2,13-var*5)', function(res) {
                    done();
                    expect(res).to.equal(5);
                }, failure, defineVariableValue);
            });
            it('10-sum(var,1) -----> 7', function(done) {
                rpn.calculator('10-sum(var,1)', function(res) {
                    done();
                    expect(res).to.equal(7);
                }, failure, defineVariableValue);
            });
        });
    });
});
