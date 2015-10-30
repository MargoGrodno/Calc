var rpn = require('./calc');

//var res = rpn.calculator('-gaverage(12,5)');

/*var stack = [{
    type: "variable",
    name: "s",
    value: undefined
}, {
    type: "number",
    value: 5
}, {
    type: "variable",
    name: "se",
    value: undefined
}, {
    type: "number",
    value: 54
}, {
    type: "variable",
    name: "set",
    value: undefined
}];

plus = {
    type: 'operator',
    value: 'sum',
    numArgs: 4
};
*/

rpn.calculatorA('var-(-(1-var1)+var2)', function(args) {
    console.log(args);
}, function(str) {
    console.log('fail: ' + str)
});
