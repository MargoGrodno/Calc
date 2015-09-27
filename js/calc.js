function preparationExpr (expr) {
	expr = expr.replace(/\s+/g, '');
	var readyExpr = expr.split('');
	var i=1;
	debugger;
	while(readyExpr[i]){
		if( !isNaN(readyExpr[i-1]) && !isNaN(readyExpr[i]) ) {
			readyExpr[i-1] =readyExpr[i-1] +readyExpr.splice(i,1);
			i--
		}
		i++;
	}
	return readyExpr;
}


var isFirstLowerPriority = function (first,second) {
	var priority1, priority2;
	if (first=='*'||first=='/') {
		priority1=3;
	}
	if (first=='+'||first=='-') {
		priority1=2;
	}
	if (first=='(') {
		priority1=1;
	}
	if (second=='*'||second=='/') {
		priority2=3;
	}
	if (second=='+'||second=='-') {
		priority2=2;
	}
	if(priority1<priority2){
		return true;
	}
	return false;
}

function takeAllNumber (expr,resultExpr, curent){
	var num = curent;
	while(!isNaN(expr[0])){
		num =num + expr.shift();
	}
	resultExpr.push(Number(num));
	return resultExpr;
}

function toRPN(expr) {
	var resultExpr =[];
	var tempStack =[];
	while(Boolean(expr[0])){
		var curent = expr.shift();
		if (!isNaN(curent)) {
			takeAllNumber(expr,resultExpr,curent);
			continue;
		}
		if(curent=='(') {
			tempStack.push(curent);
			continue;
		}
		if(curent==')') {
			while (tempStack[tempStack.length-1]!='(') {
				if(tempStack.length!=0){
					resultExpr.push(tempStack.pop());
				}
			}
			tempStack.pop();
			continue;
		}
		if ((curent=='*')||(curent=='/')||(curent=='+')||(curent=='-')) {
			if(tempStack.length==0) {
				tempStack.push(curent);
				continue;
			}
			if(isFirstLowerPriority(tempStack[tempStack.length-1],curent)){
				tempStack.push(curent);
				continue;
			}
			else {
				while(Boolean(tempStack[0])&&!isFirstLowerPriority(tempStack[tempStack.length-1],curent)){
					resultExpr.push(tempStack.pop());
				}
				tempStack.push(curent);
				continue;
			}
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
