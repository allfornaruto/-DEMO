const Number = require('./utils/Number');
const params = require('./config');

const addResult = Number.add(params.a , params.b);
const minusResult = Number.minus(params.a , params.b);
const multiplyResult = Number.multiply(params.a , params.b);
const divideResult = Number.divide(params.a , params.b);