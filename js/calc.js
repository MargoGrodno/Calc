var utils = require('./utils');
var allowableMathSymbols = '+-*/';
var allowableCharForVariable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var embeddedMethods = ['sum','multipl','aaverage','gaverage','factorial','sqrt'];

function isEmbeddedMethod (str){
	for (i=0; i < embeddedMethods.length; i++){
		if (embeddedMethods[i] == str){
			return true;
		}
	}
	return false;
}

function isCharOneOf(a,allowableChars) {
	if (allowableChars.indexOf(a) != -1){
		return true;
	}
	return false;
}

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

function factorial (arg){
	if(arg.length!=1){
		throw new Error('factorial must have only one parameter');
	}
	var num = arg[0];
	var res= 1;
	for(i=1;i<=num;i++){
		res*=i;
	}
	return res;
}

function sum (args) {
	result = 0; 
  	for (var i = 0; i < args.length; i++) {
    	result += Number(args[i]);
  	}
  	return result;
}

function sqrt (arg) {
	if(arg.length!=1){
		throw new Error('sqrt must have only one parameter');
	}
	return Math.sqrt(arg[0]);
}

function multiplication (args) {	
	result = 1; 
  	for (var i = 0; i < args.length; i++) {
    	result *= Number(args[i]);
  	}
  	return result;
}

function arithmeticAverage(args) {
	result = 0; 
  	for (var i = 0; i < args.length; i++) {
    	result +=args[i];
  	}
  	result /= args.length;
  	return result;
}

function geometricAverage(args) {
	result = 0; 
  	for (var i = 0; i < args.length; i++) {
    	result +=args[i]*args[i];
  	}
  	result = sqrt([result]);
  	return result;
}

function getLast (array) {
	return array[array.length-1]
}

function getPriority (symbol){
	switch (symbol) { //'sum','multipl','aaverage','gaverage','factorial','sqrt'
		case 'sum':
		case 'multipl':
		case 'aaverage':
		case 'gaverage':
		case 'factorial':
		case 'sqrt':
			return 5;
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
	var curentIndex = indexFrom + 1;
	while(isNumber(expr[curentIndex])){ 
		allNumber = allNumber + expr[curentIndex];
		curentIndex++;
	}
	return allNumber;
}

function takeAllVariableName (expr, indexFrom){
	var allName = expr[indexFrom];
	var curentIndex = indexFrom +1;
	while( isAllwableCharForVariable(expr[curentIndex])){ 
		allName = allName + expr[curentIndex];
		curentIndex++;
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
				if (tempStack.length != 0){
					if( isEmbeddedMethod( getLast(tempStack).value ) ){
						resultExpr.push(tempStack.pop());
					}	
				}
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

function countNumArgs(str, indexFrom){
	var stack = [];
	var numDeletedCommas = 0;
	while(true){
		if(str[indexFrom]=='(' || str[indexFrom]==','){
			stack.push(str[indexFrom]);
		}
		if(str[indexFrom]==')'){
			var numDeletedCommas = 0;
			while(getLast(stack)!='('){
				if(stack.length == 0){
					throw new Error('incorrect expression');
				}
				numDeletedCommas++;
				stack.pop()
			}
			if(stack.length==1){
				return numDeletedCommas +1;
			}
			stack.pop()
		}
		indexFrom++;
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

		if (isAllwableMathSymbol(curent)){
			if(curent == '-' && (previous == '(' || previous == undefined || previous ==',')){
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

		if (isCharOneOf(curent, allowableCharForVariable)) {
			curent = takeAllVariableName(exprCharByChar, i);
			if (isEmbeddedMethod(curent)){
				var numArgs = countNumArgs(str,i);
				resultExprArray.push({type: 'multi operator', value: curent, numArgs: numArgs});
			}
			else{
				resultExprArray.push({type: 'variable', value: curent});	
			}
			i += curent.length;
			continue;	
		}

		if(curent == ','){
			resultExprArray.push({type: 'comma', value: curent});
			i++;
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

		if (curent.type == 'binary operator' || curent.type == 'unary operator' || curent.type == 'multi operator') {
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

		if (curent.type == 'comma'){
			while(getLast(tempStack).value != '('){
				if(tempStack.length == 0){
					throw new Error('incorrect expression: comma not in embedded method ');
				}
				rpnExpr.push(tempStack.pop());
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

function applyEmbeddedFunction (args, func) {
	var res;                                  //обработать если пришли переменные
	switch (func.value) {  //'multipl', 'aaverage', 'gaverage', 'factorial', 'sqrt'
			case "sum":
				res = sum(args);
				break;
			case "multipl":
				res = multiplication(args);
				break;
			case "aaverage":
				res = arithmeticAverage(args);
				break;
			case "gaverage":
				res = geometricAverage(args);
				break;
			case "factorial":
				res = factorial(args);
				break;
			case "sqrt":
				res = sqrt(args);
				break;
			default:
				throw new Error('Unsupported operation (embeddedMethods)');
	}
	return {type: 'number', value: res};
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

		if (operation.type == 'multi operator'){
			var numArgs = operation.numArgs;
			if(stack.length < numArgs){
				throw new Error('incorrect expression (3)');
			}	
			var args =[];
			for (j=0; j < numArgs; j++){
				args.push(stack.pop().value);
			}
			var result = applyEmbeddedFunction(args, operation);

			stack.push(result);
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
	convertStrExprToArrayExpr: convertStrExprToArrayExpr,
	sum: sum,
	factorial:factorial,
	sqrt:sqrt,
	countNumArgs:countNumArgs,
	geometricAverage:geometricAverage
};
