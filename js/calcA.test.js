var assert = require('assert');
var expect = require("chai").expect;
var rpn = require('./calc');


describe('Calculation using Reverse Polish Notation', function() {

    describe('Asynchronous call', function() {

        describe('General expressions', function() {

            it('12+9 ---> 21', function(done) {
                rpn.calculator('12+9', function(res) {
                    done();
                    expect(res).to.equal(21);
                }, function(str) {
                    console.log(str);
                });
            });
            it('(6+8)/7*6 ---> 12', function(done) {
                rpn.calculator('(6+8)/7*6', function(res) {
                    done();
                    expect(res).to.equal(12);
                }, function(str) {
                    console.log(str);
                });
            });
            it('(14+22*((5-3+1*0+0*1))) ---> 58', function(done) {
                rpn.calculator('(14+22*((5-3+1*0+0*1)))', function(res) {
                    done();
                    expect(res).to.equal(58);
                }, function(str) {
                    console.log(str);
                });
            });
            it('1*(0+0+3+0)+90807 ---> 90810', function(done) {
                rpn.calculator('1*(0+0+3+0)+90807', function(res) {
                    done();
                    expect(res).to.equal(90810);
                }, function(str) {
                    console.log(str);
                });
            });
            it('33/0 ---> Infinity', function(done) {
                rpn.calculator('33/0', function(res) {
                    done();
                    expect(res).to.equal(Infinity);
                }, function(str) {
                    console.log(str);
                });
            });
        });

        describe('Unary minus', function() {
            it('56-(-(1-2)+2) -----> 53', function(done) {
                rpn.calculator('56-(-(1-2)+2)', function(res) {
                    done();
                    expect(res).to.equal(53);
                }, function(str) {
                    console.log(str);
                });
            });
        });

        describe('Variables', function() {
            it('t+h -----> 4', function(done) {
                rpn.calculator('t+h', function(res) {
                    done();
                    expect(res).to.equal(4);
                }, function(str) {
                    console.log(str);
                });
            });
            it('djfh+1 -----> 3', function(done) {
                rpn.calculator('djfh+1', function(res) {
                    done();
                    expect(res).to.equal(3);
                }, function(str) {
                    console.log(str);
                });
            });
            it('var-(-(1-var1)+var2) -----> -1', function(done) {
                rpn.calculator('var-(-(1-var1)+var2)', function(res) {
                    done();
                    expect(res).to.equal(-1);
                }, function(str) {
                    console.log(str);
                });
            });
        });

        describe('Embedded Methods', function() {
            it('sum(5,sum(6,5),8,sum(4,sum(3,7),5)) -----> 43', function(done) {
                rpn.calculator('sum(5,sum(6,5),8,sum(4,sum(3,7),5))', function(res) {
                    done();
                    expect(res).to.equal(43);
                }, function(str) {
                    console.log(str);
                });
            });
            it('aaverage(5,7,9)+factorial(4)+(gaverage(6,24)+6)/(5+mult(1,2*2)) -----> 33', function(done) {
                rpn.calculator('aaverage(5,7,9)+factorial(4)+(gaverage(6,24)+6)/(5+mult(1,2*2))', function(res) {
                    done();
                    expect(res).to.equal(33);
                }, function(str) {
                    console.log(str);
                });
            });

        });

        describe('Embedded Methods & Variables', function() {
            it('sum(2,13-var*5) -----> 5', function(done) {
                rpn.calculator('sum(2,13-var*5)', function(res) {
                    done();
                    expect(res).to.equal(5);
                }, function(str) {
                    console.log(str);
                });
            });
            it('10-sum(var,1) -----> 7', function(done) {
                rpn.calculator('10-sum(var,1)', function(res) {
                    done();
                    expect(res).to.equal(7);
                }, function(str) {
                    console.log(str);
                });
            });
        });
    });
});
