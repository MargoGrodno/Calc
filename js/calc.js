function isNumber(a) {
	return typeof a == 'number';
}

function getPriority (symbol){
	switch (symbol) {
		case "*":
		case "/":
			return 3;
		case "+":
		case "-":
			return 2;
		case "(":
			return 1;
	}
}

var isFirstLowerPriority = function (first,second) {
	return getPriority(first) < getPriority(second);
}

function takeAllNumberToResultExpr (expr,resultExpr, curent){
	var num = curent;
	while(!isNaN(expr[0])){ //
		num =num + expr.shift();
	}
	resultExpr.push(Number(num));
	return resultExpr;
}

function removeBrackets (resultExpr,tempStack) {
	while (tempStack[tempStack.length-1] != '(' ) {
		if(tempStack.length!=0){
			resultExpr.push(tempStack.pop());
		}
	}
	tempStack.pop();
}

function processMathOperator (resultExpr,tempStack,curent) {
	if(tempStack.length==0 || isFirstLowerPriority(tempStack[tempStack.length-1],curent)) {
		tempStack.push(curent);
	} else {
		while(Boolean(tempStack[0]) && !isFirstLowerPriority(tempStack[tempStack.length-1],curent)){
			resultExpr.push(tempStack.pop());
		}
		tempStack.push(curent);
	}
}

function toRPN(expr) {
	var resultExpr =[];
	var tempStack =[];

	expr = expr.split('');

	while(Boolean(expr[0])){
		var curent = expr.shift();
		if (!isNaN(curent)) {
			takeAllNumberToResultExpr(expr,resultExpr,curent);
			continue;
		}
		if ((curent == '*') || (curent == '/') || (curent == '+') || (curent == '-')) {
			processMathOperator(resultExpr, tempStack, curent);
			continue;
		}
		if(curent == '(') {
			tempStack.push(curent);
			continue;
		}
		if(curent == ')') {
			removeBrackets(resultExpr,tempStack);			
		}
	}

	while(Boolean(tempStack[0])){
		resultExpr.push(tempStack.pop());
	}
	return resultExpr
}

function simpleMathAction(a, b, sign){
	var res;
	switch (sign) {
			case "+":
				res= Number(a)+Number(b);
				break;
			case "-":
				res= Number(a)-Number(b);
				break;
			case "*":
				res= Number(a)*Number(b);
				break;
			case "/":
				res= Number(a)/Number(b);
				break;
			default:
				throw new Error('Unsupported operation');
	}
	return res;
}

function calculator(str){
	var expr = toRPN(str);

	return calculateRpn(expr);
}


function calculateRpn(expr) {
	var i = 0;
	var stack = [];

	while(i < expr.length) {
		if(isNumber(expr[i])) {
			stack.push(expr[i]);
			i++;
			continue;
		}

		var operation = expr[i];

		if(stack.length < 2) {
			throw new Error('incorrect expression');
		}

		var second = stack.pop(); 
		var first = stack.pop(); 

		var result = simpleMathAction(first, second, operation);

		stack.push(result);

		i++;
	}

	if(stack.length != 1) {
		throw new Error('incorrect expression');
	}
	return stack.pop();
}

module.exports = {
	calculator:calculator,
	calculateRpn:calculateRpn
};
