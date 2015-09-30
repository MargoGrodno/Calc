function sum() {
	result = arguments[0]; 
  	for (var i = 1; i < arguments.length; i++) {
    	result +=arguments[i];
  	}
  	return result;
}

function arithmeticAverage() {
	result = arguments[0]; 
  	for (var i = 1; i < arguments.length; i++) {
    	result +=arguments[i];
  	}
  	result /= arguments.length;
  	return result;
}

function isNumber(a) {
	if (typeof a == 'number') {
		return true;	
	} 					// Не уверена что так делать верно, но мне нужно как-то определить является ли символ цифрой. 
	return !isNaN(a);	// вариант когда просто по typeof  для случая с цифрой в виде чара не срабатывает.
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
	var allNumber = curent;
	while(isNumber(expr[0])){ 
		allNumber = allNumber + expr.shift();
	}
	resultExpr.push(Number(allNumber));
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

function toRPN(str) {
	var rpnExpr =[];
	var tempStack =[];
	var expr = str.split('');

	while(Boolean(expr[0])){
		var curent = expr.shift();
		if (!isNaN(curent)) {
			takeAllNumberToResultExpr(expr,rpnExpr,curent);
			continue;
		}
		if ((curent == '*') || (curent == '/') || (curent == '+') || (curent == '-')) {
			processMathOperator(rpnExpr, tempStack, curent);
			continue;
		}
		if(curent == '(') {
			tempStack.push(curent);
			continue;
		}
		if(curent == ')') {
			removeBrackets(rpnExpr,tempStack);			
		}
	}

	while(Boolean(tempStack[0])){
		rpnExpr.push(tempStack.pop());
	}
	return rpnExpr
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
	calculateRpn:calculateRpn,
	sum: sum,
	arithmeticAverage: arithmeticAverage
};
