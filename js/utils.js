function getLast(array) {
    return array[array.length - 1]
}

function isCharAllowableForStartVar(char) {
	var regex = new RegExp(/^([A-Z]|[a-z]){1}$/);
    return regex.test(char);
}

function isCharAllowableForVar(char) {
	var regex = new RegExp(/^([A-Z]|[a-z]|[0-9]){1}$/);
    return regex.test(char);
}

function isCharAllowableMathSymbol(char) {
	var regex = new RegExp(/^(\+|\-|\*|\/){1}$/);
    return regex.test(char);
}

function isStrIsNumber(str) {
    var regex = new RegExp(/^[-|+]?[0-9]+(\.[0-9]*)?$/);
    return regex.test(str);
}

function isUnaryMinus(str, index) {
    var curent = str[index];
    var previous = str[index - 1];
    return (curent == '-' && (previous == '(' || previous == undefined || previous == ','))
}

function getPriority(symbol) {
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

function isFirstLowerPriority(first, second) {
    return getPriority(first) < getPriority(second);
}

function takeAllNumber(str, indexFrom) {
    var allNumber = str[indexFrom];
    var curentIndex = indexFrom + 1;
    while (isCharNumber(str[curentIndex])) {
        allNumber = allNumber + str[curentIndex];
        curentIndex++;
    }
    return allNumber;
}

function takeAllVariableName(str, indexFrom) {
    var allName = str[indexFrom];
    var curentIndex = indexFrom + 1;
    while (isCharAllowableForVar(str[curentIndex])) {
        allName = allName + str[curentIndex];
        curentIndex++;
    }
    return allName;
}

module.exports = {
    getLast: getLast,
    isStrIsNumber: isStrIsNumber,
    isUnaryMinus: isUnaryMinus,
    isFirstLowerPriority: isFirstLowerPriority,
    takeAllNumber: takeAllNumber,
    takeAllVariableName: takeAllVariableName,
    isCharAllowableForStartVar: isCharAllowableForStartVar,
    isCharAllowableMathSymbol: isCharAllowableMathSymbol
};
