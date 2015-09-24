exports.preparationExpr = function (expr) {
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