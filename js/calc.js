var utils = require('./utils');
var embeddedMethods = require('./embeddedMethods');
var consoleReader = require('./consoleReader');

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
        } 
        else {
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
        if (utils.isCharNumber(curent)) {
            curent = utils.takeAllNumber(exprCharByChar, i);
            resultExprArray.push({
                type: 'number',
                value: Number(curent)
            });
            i += curent.length;
            continue;
        }

        var isCurentStartVariable = utils.isCharOneOf(curent, utils.allowableForStartVariable);
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

        var isCurentMathSymbol = utils.isCharOneOf(curent, utils.allowableMathSymbols);
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
            makeOperation(operation, stack);
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

function makeOperation(operation, stack) {
    if (stack.length < operation.numArgs) {
        throw new Error('incorrect expression (1)');
    }

    var args = takeArgs(stack, operation.numArgs);
    var result = simpleMathAction(args, operation);
    stack.push(result);
}

function takeArgs(stack, numArgs) {
    var args = [];

    while (args.length < numArgs) {
        var arg = stack.pop();
        if (arg.type == 'variable') {
            defineVariableValue(arg);
        }
        args.push(arg.value);
    }
    return args;
}

function defineVariableValue(variable) {
    /*consoleReader.takeVariableValue(variable.name, function(value) {
            variable.value = value;
            console.log('variable ' + variable.name + ' now is ' + variable.value);
        });
*/
    variable.value = 2; //пока заполняю все переменные значением 2. потом надо как то их доставать
}

function calculator(str) {
    var expr = toRPN(str);

    return calculateRpn(expr);
}

module.exports = {
    calculator: calculator
};
