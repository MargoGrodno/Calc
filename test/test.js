var expect    = require("chai").expect;
var calculator = require("../js/bla");


describe("Arithmetic computer", function(){
	describe("Preparation expression", function(){
		it("should return clean expression", function(){
			var expression = "3- 40";
			var result = calculator.preparationExpr(expression);
			expect(result[2]).to.equal('40');
		});
	});
	
});