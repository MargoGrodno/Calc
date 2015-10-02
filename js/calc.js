var allowableMathSymbols = '+-*/';
var allowableCharForVariable = 'abcdefghijklmnopqrstuvwxyz0123456789';

function isAllwableMathSymbol(a) {
	if (allowableMathSymbols.indexOf(a) != -1){
		return true;
	}
	return false;
}

function isAllwableCharForVariable(a) {
	if (allowableCharForVariable.indexOf(a) != -1){
		return true;
	}
	return false;
}

function isNumber(a) {
	if (typeof a == 'number') {
		return true;	
	} 					// Не уверена что так делать верно, но мне нужно как-то определить является ли символ цифрой. 
	return !isNaN(a);	// вариант когда просто по typeof  для случая с цифрой в виде чара не срабатывает.
}

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

function getLast (array) {
	return array[array.length-1]
}

function getPriority (symbol){
	switch (symbol) {
		case '-!':
			return 4;
		case '*':
		case '/':
			return 3;
		case '+':
		case '-':
			return 2;
		case '(':
			return 1;
	}
}

var isFirstLowerPriority = function (first, second) {
	return getPriority(first) < getPriority(second);
}

function takeAllNumber (expr, indexFrom){
	var allNumber = expr[indexFrom];
	indexFrom++;
	while(isNumber(expr[indexFrom])){ 
		allNumber = allNumber + expr[indexFrom];
		indexFrom++;
	}
	return allNumber;
}

function takeAllVariableName (expr, indexFrom){
	var allName = expr[indexFrom];
	var i = indexFrom +1;
	while( isAllwableCharForVariable(expr[i]) !=0){ 
		allName = allName + expr[i];
		i++;
	}
	return allName;
}

function removeBrackets (resultExpr, tempStack) {
	while (true){
		if (tempStack.length != 0){
			if(getLast(tempStack).value != '('){
				resultExpr.push(tempStack.pop());
			}
			else {
				tempStack.pop();
				return;
			}
		}
		else{
			throw new Error ('incorrect expression: brackets error');
		}
	}
}

function processMathOperator (resultExpr,tempStack,curent) {
	if (tempStack.length == 0 || isFirstLowerPriority( getLast(tempStack).value, curent.value)) {   
		tempStack.push(curent);
	} else {
		while(tempStack.length != 0 && !isFirstLowerPriority(getLast(tempStack).value, curent.value)){
			resultExpr.push(tempStack.pop());
		}
		tempStack.push(curent);
	}
}

function convertStrExprToArrayExpr (str) {
	var exprCharByChar = str.split('');
	var resultExprArray = [];
	var i=0;
	while (i < exprCharByChar.length){
		
		var curent = exprCharByChar[i];
		var previous = exprCharByChar[i-1]
		
		if (isNumber(curent)){
			curent = takeAllNumber(exprCharByChar,i);
			resultExprArray.push({type: 'number', value: Number(curent)});
			i += curent.length;
			continue;
		}

		if ( isAllwableMathSymbol(curent)){
			if(curent == '-' && (previous == '(' || previous == undefined)){
				resultExprArray.push({type: 'unary operator', value: '-!'});
			}
			else{
				resultExprArray.push({type: 'binary operator', value: curent});
			}
			i++;
			continue;
		}

		if (curent =='(' || curent == ')') {
			resultExprArray.push({type: 'bracket', value: curent});
			i++;
			continue;
		};

		if (curent == '_') {
			curent = takeAllVariableName(exprCharByChar, i);
			resultExprArray.push({type: 'variable', value: curent});
			i += curent.length;
			continue;	
		}

		throw new Error('incorrect expression: uncuported symbol '+ curent)
	}	
	return resultExprArray;
}

function toRPN(str) {
	var rpnExpr =[];
	var tempStack =[];
	var expr = convertStrExprToArrayExpr(str);

	while(expr.length != 0){
		var curent = expr.shift();
		
		if (curent.type == 'number' || curent.type == 'variable' ) {
			rpnExpr.push(curent);			
			continue;
		}

		if (curent.type == 'binary operator' || curent.type == 'unary operator' ) {
			processMathOperator(rpnExpr, tempStack, curent);							 
			continue;
		}

		if(curent.type == 'bracket'){
			if(curent.value == '(') {
				tempStack.push(curent);
				continue;
			}
			if(curent.value == ')') {
				removeBrackets(rpnExpr,tempStack);		    
			}	
		}
	}

	while(tempStack.length != 0){
		rpnExpr.push(tempStack.pop());
	}
	return rpnExpr
}

function defineVariableValue (variable) {
	return {type: 'number', value: 2}; //пока заполняю все переменные значением 2. потом надо как то их доставать
}

function simpleMathAction(a, b, operation){
	var res;
	if (a.type == 'variable'){
		a = defineVariableValue(a);         		
	}
	if (b.type == 'variable'){
		b = defineVariableValue(b);
	}
	switch (operation.value) {
			case "+":
				res= Number(a.value)+Number(b.value);
				break;
			case "-":
				res= Number(a.value)-Number(b.value);
				break;
			case "*":
				res= Number(a.value)*Number(b.value);
				break;
			case "/":
				res= Number(a.value)/Number(b.value);
				break;
			default:
				throw new Error('Unsupported operation');
	}
	return {type: 'number', value: res};
}

function calculator(str){
	var expr = toRPN(str);

	return calculateRpn(expr);
}


function calculateRpn(expr) {
	var i = 0;
	var stack = [];

	while(i < expr.length) {
		if(expr[i].type == 'number' || expr[i].type == 'variable') {
			stack.push(expr[i]);
			i++;
			continue;
		}

		var operation = expr[i];
		
		if (operation.type == 'binary operator'){
			if(stack.length < 2){
				throw new Error('incorrect expression (1)');
			}	
			var second = stack.pop();  		
			var first = stack.pop(); 
			if(second.type == 'variable'){
				second = defineVariableValue(second);
			}
			if(first.type == 'variable'){
				first = defineVariableValue(first);
			}

			var result = simpleMathAction(first, second, operation);

			stack.push(result);
		}

		if (operation.type == 'unary operator'){
			var numForUnaryOperation = stack.pop();
			if (numForUnaryOperation.type == 'variable'){
				numForUnaryOperation = defineVariableValue(numForUnaryOperation);
			}
			if (operation.value == '-!'){
				stack.push({type: 'number', value: -numForUnaryOperation.value})
			} else {
				throw new Error('unsuported unary operation');
			}
		}
		
		i++;
	}

	if(stack.length != 1) {
		throw new Error('incorrect expression (2)');
	}
	return stack.pop().value;
}

module.exports = {
	calculator:calculator,
	calculateRpn:calculateRpn,
	sum: sum,
	toRPN: toRPN,
	arithmeticAverage: arithmeticAverage,
	takeAllVariableName: takeAllVariableName,
	convertStrExprToArrayExpr: convertStrExprToArrayExpr
};
