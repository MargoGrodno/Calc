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
	while(!isNaN(expr[0])){
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
				return 'Error';
	}
	return res;
}

function calculator(expr){
	expr = expr.split('');
	expr = toRPN(expr);
	var i=0;
	while(expr.length!=1){
		while(!isNaN(expr[i])){ 
			i++;
		}
		if(i>1){
			var actionRes = simpleMathAction(expr[i-2],expr[i-1],expr[i]);
			if(actionRes=='Error'){ return null;}
			expr.splice(i-2, 3, actionRes);
			i=i-2;
		}
	}
	return expr[0];
}

module.exports = {
	calculator:calculator
};
