var utils = require('./utils');
var embeddedMethods = require('./embeddedMethods');

function countNumArgs(str, indexFrom) {
    var stack = [];
    while (indexFrom < str.length) {
        if (str[indexFrom] == '(' || str[indexFrom] == ',') {
            stack.push(str[indexFrom]);
        }
        if (str[indexFrom] == ')') {
            var numDeletedCommas = 0;
            while (utils.getLast(stack) != '(') {
                if (stack.length == 0) {
                    throw new Error('incorrect expression: incorrect use of embedded method');
                }
                stack.pop();
                numDeletedCommas++;
            }
            if (stack.length == 1) {
                return numDeletedCommas + 1;
            }
            stack.pop()
        }
        indexFrom++;
    }
    throw new Error('incorrect expression: incorrect use of embedded method');
}

function checkingForEMBrackets(resultExpr, tempStack) {
    if (tempStack.length != 0) {
        if (embeddedMethods.isEmbeddedMethod(utils.getLast(tempStack).value)) {
            resultExpr.push(tempStack.pop());
        }
    }
}

function removeBrackets(resultExpr, tempStack) {
    var isOpenBracketFind = false;

    while (!isOpenBracketFind) {
        if (tempStack.length == 0) {
            throw new Error('incorrect expression: brackets error');
        }

        if (utils.getLast(tempStack).value != '(') {
            resultExpr.push(tempStack.pop());
        } else {
            tempStack.pop();
            checkingForEMBrackets(resultExpr, tempStack);
            isOpenBracketFind = true;
        }
    }
}

function processMathOperator(resultExpr, tempStack, curent) {
    if (tempStack.length == 0 || utils.isFirstLowerPriority(utils.getLast(tempStack).value, curent.value)) {
        tempStack.push(curent);
    } else {
        while (tempStack.length != 0 && !utils.isFirstLowerPriority(utils.getLast(tempStack).value, curent.value)) {
            resultExpr.push(tempStack.pop());
        }
        tempStack.push(curent);
    }
}

function simpleMathAction(args, operation) {
    var res;
    switch (operation.value) {
        case "-!":
            res = -Number(args[0]);
            break;
        case "+":
            res = Number(args[1]) + Number(args[0]);
            break;
        case "-":
            res = Number(args[1]) - Number(args[0]);
            break;
        case "*":
            res = Number(args[1]) * Number(args[0]);
            break;
        case "/":
            res = Number(args[1]) / Number(args[0]);
            break;
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
            throw new Error('Unsupported operation');
    }
    return {
        type: 'number',
        value: res
    };
}

function convertStrExprToArrayExpr(str) {
    var exprCharByChar = str.split('');
    var resultExprArray = [];
    var i = 0;
    while (i < exprCharByChar.length) {

        var curent = exprCharByChar[i];
        if (utils.isStrIsNumber(curent)) {
            curent = utils.takeAllNumber(exprCharByChar, i);
            resultExprArray.push({
                type: 'number',
                value: Number(curent)
            });
            i += curent.length;
            continue;
        }

        var isCurentStartVariable = utils.isCharAllowableForStartVar(curent);
        if (isCurentStartVariable) {
            curent = utils.takeAllVariableName(exprCharByChar, i);
            if (embeddedMethods.isEmbeddedMethod(curent)) {
                var numArgs = countNumArgs(str, i);
                resultExprArray.push({
                    type: 'operator',
                    value: curent,
                    numArgs: numArgs
                });
            } else {
                resultExprArray.push({
                    type: 'variable',
                    name: curent,
                    value: undefined
                });
            }
            i += curent.length;
            continue;
        }

        var isCurentMathSymbol = utils.isCharAllowableMathSymbol(curent);
        if (isCurentMathSymbol) {
            if (utils.isUnaryMinus(exprCharByChar, i)) {
                var numArgs = 1;
                var value = '-!';
            } else {
                var numArgs = 2;
                var value = curent;
            }
            resultExprArray.push({
                type: 'operator',
                value: value,
                numArgs: numArgs
            });
            i++;
            continue;
        }

        if (curent == '(' || curent == ')') {
            resultExprArray.push({
                type: 'bracket',
                value: curent
            });
            i++;
            continue;
        };

        if (curent == ',') {
            resultExprArray.push({
                type: 'comma',
                value: curent
            });
            i++;
            continue;
        }

        throw new Error('incorrect expression: uncuported symbol ' + curent)
    }
    return resultExprArray;
}

function toRPN(str) {
    var rpnExpr = [];
    var tempStack = [];
    var expr = convertStrExprToArrayExpr(str);

    while (expr.length != 0) {
        var curent = expr.shift();

        if (curent.type == 'number' || curent.type == 'variable') {
            rpnExpr.push(curent);
            continue;
        }

        if (curent.type == 'operator') {
            processMathOperator(rpnExpr, tempStack, curent);
            continue;
        }

        if (curent.type == 'bracket') {
            if (curent.value == '(') {
                tempStack.push(curent);
                continue;
            }
            if (curent.value == ')') {
                removeBrackets(rpnExpr, tempStack);
            }
        }

        if (curent.type == 'comma') {
            if (tempStack.length == 0) {
                throw new Error('incorrect expression: comma not in embedded method ');
            }
            while (utils.getLast(tempStack).value != '(') {               
                rpnExpr.push(tempStack.pop());
                if (tempStack.length == 0) {
                    throw new Error('incorrect expression: comma not in embedded method ');
                }
            }
        }
    }

    while (tempStack.length != 0) {
        rpnExpr.push(tempStack.pop());
    }
    if(rpnExpr.length ==0 ){
        throw new Error('empty expression');
    }
    return rpnExpr
}

function calculator(str, succeed, failure, defineVariableValue) {
    if (succeed == undefined) {
        var result;
        calculateRpnA(str, function(res){
            result = res;
        }, function (e) {
            throw e;
        }, function (variable, succeed, failure) {
            variable.value = 2;
            succeed(variable);
        });
        return result;
    }
    else {
        calculateRpnA(str, succeed, failure, defineVariableValue);
    }
}

function calculateRpnA(str, succeed, failure, defineVariableValue) {
    try{
        var arrExprRPN = toRPN(str);   
    } catch(e){
        failure(e);
    }
    var i = 0;
    var stack = [];

    function continueWith() {
        if (i < arrExprRPN.length) {
            findOperation();
        } else {
            if (stack.length != 1) {
                failure(new Error('incorrect expression'));
            } else {
                succeed(stack.pop().value);
            }
        }
    }

    function putAllOperandsToStack() {
        if (arrExprRPN[i].type == 'number' || arrExprRPN[i].type == 'variable') {
            stack.push(arrExprRPN[i]);
            i++;
            if (i < arrExprRPN.length) {
                putAllOperandsToStack();
            }
        }
    }

    function findOperation() {
        if (i < arrExprRPN.length) {
            putAllOperandsToStack();
        }

        var operator = arrExprRPN[i];
        if (operator == undefined || operator.type != 'operator'){
            failure(new Error('incorrect RPN expr'));
        }
        i++;
        makeOperationA(operator, stack, continueWith, failure, defineVariableValue);
    }

    findOperation();
}

function makeOperationA(operation, stack, succeed, failure, defineVariableValue) {

    function continueWith(arr) {
        var args = arr;
        var result = simpleMathAction(args, operation);
        stack.push(result);
        succeed();
    };

    if (stack.length < operation.numArgs) {
        failure(new Error('incorrect expression'));
    } else {
        takeArgsA(stack, operation.numArgs, continueWith, failure, defineVariableValue);
    }
}

function takeArgsA(stack, numArgs, succeed, failure, defineVariableValue) {
    var args = [];

    function continueWith(arg) {
        args.push(arg.value);
        if (args.length < numArgs) {
            takeArgA(stack, continueWith, failure, defineVariableValue);
        } else {
            succeed(args);
        }
    }

    takeArgA(stack, continueWith, failure, defineVariableValue);
}

function takeArgA(stack, succeed, failure, defineVariableValue) {
    var arg = stack.pop();

    if (arg.type == 'variable') {
        defineVariableValue(arg, function (variable) {
            succeed(variable);
        }, failure);
    }
    if (arg.type == 'number') {
        succeed(arg);
    }
    if (arg.type != 'number' && arg.type != 'variable') {
        failure(new Error('not suported type'));
    }
}

module.exports = {
    calculator: calculator,
    takeArgsA: takeArgsA,
    makeOperationA: makeOperationA
};