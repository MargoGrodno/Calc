function preparationExpr(expr) {
	expr = expr.replace(/\s+/g, '');
	var readyExpr = expr.split('');
	var i=1;
	while(readyExpr[i]){
		if(Number.isInteger(Number(readyExpr[i-1]))&&Number.isInteger(Number(readyExpr[i]))){
			readyExpr[i-1] =readyExpr[i-1] +readyExpr.splice(i,1);
			i--
		}
		i++;
	}
	return readyExpr;
}

function isAllCharValid(expr){
	for(i=0; i < expr.length; i++){
		if(!Number.isInteger(Number(expr[i]))&&(expr[i]!='+')&&(expr[i]!='-')&&(expr[i]!='/')&&(expr[i]!='*')&&(expr[i]!='(')&&(expr[i]!=')')){
			return false;
		}
	}
	return true;
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

function toRPN(expr) {
	var resultExpr =[];
	var tempStack =[];
	while(Boolean(expr[0])){
		var curent = expr.shift();
		if (Number.isInteger(Number(curent))) {
			resultExpr.push(curent);
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
				else{
					return null;
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
	var res;
	var i=0;
	while(expr.length!=1){
		while(Number.isInteger(Number(expr[i]))){ i++;}
		if(i>1){
			var actionRes = simpleMathAction(expr[i-2],expr[i-1],expr[i]);
			if(actionRes=='Error'){ return null;}
			expr.splice(i-2, 3, actionRes);
			i=i-2;
		}
		else{
			return null;
		}
	}
	res=expr[0];
	return res;
}

module.exports = {
	preparationExpr:preparationExpr
};
