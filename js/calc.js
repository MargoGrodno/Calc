var utils = require('./utils');
var embeddedMethods = require('./embeddedMethods');

var allowableMathSymbols = '+-*/';
var allowableForVariable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function isCharOneOf(a,allowableChars) {
	if (allowableChars.indexOf(a) != -1){
		return true;
	}
	return false;
}

function isCharNumber(char){
	return ('0' <= char && char <= '9');
}

function getLast (array) {
	return array[array.length-1]
}

function getPriority (symbol){
	switch (symbol) { 
		case 'sum':
		case 'mult':
		case 'aaverage':
		case 'gaverage':
		case 'qaverage':
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

function takeAllNumber (str, indexFrom){
	var allNumber = str[indexFrom];
	var curentIndex = indexFrom + 1;
	while(isCharNumber(str[curentIndex])){ 
		allNumber = allNumber + str[curentIndex];
		curentIndex++;
	}
	return allNumber;
}

function takeAllVariableName (str, indexFrom){
	var allName = str[indexFrom];
	var curentIndex = indexFrom +1;
	while( isCharOneOf( str[curentIndex], allowableForVariable ) ) { 
		allName = allName + str[curentIndex];
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
					if( embeddedMethods.isEmbeddedMethod( getLast(tempStack).value ) ){
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
		
		if (isCharNumber(curent)){
			curent = takeAllNumber(exprCharByChar,i);
			resultExprArray.push({type: 'number', value: Number(curent)});
			i += curent.length;
			continue;
		}

		if ( isCharOneOf( curent, allowableMathSymbols ) ){
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

		if (isCharOneOf(curent, allowableForVariable)) {
			curent = takeAllVariableName(exprCharByChar, i);
			if (embeddedMethods.isEmbeddedMethod(curent)){
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
	var res;               
	switch (func.value) { 
			case "sum":
				res = embeddedMethods.sum(args);
				break;
			case "mult":
				res = embeddedMethods.multiplication(args);
				break;
			case "aaverage":
				res = embeddedMethods.arithmeticAverage(args);
				break;
			case "gaverage":
				res = embeddedMethods.geometricAverage(args);
				break;
			case "qaverage":
				res = embeddedMethods.quadraticAverage(args);
				break;
			case "factorial":
				res = embeddedMethods.factorial(args);
				break;
			case "sqrt":
				res = embeddedMethods.sqrt(args);
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
	toRPN: toRPN,
	takeAllVariableName: takeAllVariableName,
	convertStrExprToArrayExpr: convertStrExprToArrayExpr,
	countNumArgs:countNumArgs
};
