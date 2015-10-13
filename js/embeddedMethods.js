var embeddedMethods = ['sum', 'mult', 'aaverage', 'gaverage', 'qaverage', 'factorial', 'sqrt'];

function isEmbeddedMethod(str) {
    for (i = 0; i < embeddedMethods.length; i++) {
        if (embeddedMethods[i] == str) {
            return true;
        }
    }
    return false;
}

function sum(args) {
    result = 0;
    for (var i = 0; i < args.length; i++) {
        result += args[i];
    }
    return result;
}

function multiplication(args) {
    result = 1;
    for (var i = 0; i < args.length; i++) {
        result *= args[i];
    }
    return result;
}

function arithmeticAverage(args) {
    result = 0;
    for (var i = 0; i < args.length; i++) {
        result += args[i];
    }
    result /= args.length;
    return result;
}

function geometricAverage(args) {
    result = 1;
    for (var i = 0; i < args.length; i++) {
        result *= args[i];
    }
    result = Math.pow(result, 1 / args.length);
    return result;
}

function quadraticAverage(args) {
    result = 0;
    for (var i = 0; i < args.length; i++) {
        result += args[i] * args[i];
    }
    result /= args.length;
    result = sqrt([result]);
    return result;
}

function sqrt(arg) {
    if (arg.length != 1) {
        throw new Error('sqrt must have only one parameter');
    }
    return Math.sqrt(arg[0]);
}

function factorial(arg) {
    if (arg.length != 1) {
        throw new Error('factorial must have only one parameter');
    }
    var num = arg[0];
    var res = 1;
    for (i = 1; i <= num; i++) {
        res *= i;
    }
    return res;
}

module.exports = {
    isEmbeddedMethod: isEmbeddedMethod,
    sum: sum,
    multiplication: multiplication,
    arithmeticAverage: arithmeticAverage,
    geometricAverage: geometricAverage,
    quadraticAverage: quadraticAverage,
    sqrt: sqrt,
    factorial: factorial
};
