var rpn = require('./calc');

//rpn.calculator('()');

rpn.calculator('sum(2,13-var*5)', function(res) {
    console.log(res);
}, function(err) {
    console.log('fail');
    throw err;
})

