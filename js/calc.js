var utils = require('./utils');
var embeddedMethods = require('./embeddedMethods');

function defineVariableValue(variable) {
    return {
        type: 'number',
        value: 2
    }; //пока заполняю все переменные значением 2. потом надо как то их доставать
}

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

function removeBrackets(resultExpr, tempStack) {
    while (true) {
        if (tempStack.length != 0) {
            if (utils.getLast(tempStack).value != '(') {
                resultExpr.push(tempStack.pop());
            } else {
                tempStack.pop();
                if (tempStack.length != 0) {
                    if (embeddedMethods.isEmbeddedMethod(utils.getLast(tempStack).value)) {
                        resultExpr.push(tempStack.pop());
                    }
                }
                return;
            }
        } else {
            throw new Error('incorrect expression: brackets error');
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

        if (utils.isCharNumber(curent)) {
            curent = utils.takeAllNumber(exprCharByChar, i);
            resultExprArray.push({
                type: 'number',
                value: Number(curent)
            });
            i += curent.length;
            continue;
        }

        if (utils.isCharOneOf(curent, utils.allowableMathSymbols)) {
            if (utils.isUnaryMinus(exprCharByChar, i)) {
                var numArgs = 1;
                curent ='-!';
            } else {
            	var numArgs = 2;
            }
            resultExprArray.push({
                type: 'operator',
                value: curent,
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

        if (utils.isCharOneOf(curent, utils.allowableForVariable)) {
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
                    value: curent
                });
            }
            i += curent.length;
            continue;
        }

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
            while (utils.getLast(tempStack).value != '(') {
                if (tempStack.length == 0) {
                    throw new Error('incorrect expression: comma not in embedded method ');
                }
                rpnExpr.push(tempStack.pop());
            }
        }
    }

    while (tempStack.length != 0) {
        rpnExpr.push(tempStack.pop());
    }
    return rpnExpr
}

function calculateRpn(arrExprRPN) {
    var i = 0;
    var stack = [];

    while (i < arrExprRPN.length) {
        
        if (arrExprRPN[i].type == 'number' || arrExprRPN[i].type == 'variable') {
            stack.push(arrExprRPN[i]);
            i++;
            continue;
        }

        var operation = arrExprRPN[i];

        if (operation.type == 'operator') {

            if (stack.length < operation.numArgs) {
                throw new Error('incorrect expression (1)');
            }

            var args = [];
            while (args.length < operation.numArgs) {
                var arg = stack.pop();
                if (arg.type == 'variable') {
                    arg = defineVariableValue(arg);
                }
                args.push(arg.value);
            }

            var result = simpleMathAction(args, operation);
            stack.push(result);

            i++;
            continue;
        }

        throw new Error('incorrect RPN expr');
    }

    if (stack.length != 1) {
        throw new Error('incorrect expression (2)');
    }

    return stack.pop().value;
}

function calculator(str) {
    var expr = toRPN(str);

    return calculateRpn(expr);
}

module.exports = {
    calculator: calculator
};
