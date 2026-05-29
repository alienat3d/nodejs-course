// 1.2.1 Here we'll have some simple math operations functions as an example.
/*const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;*/

// 1.2.6 We could actually export other way, if we replace "const" to "export.", so we'll add each of the functions to the export right after it been announced.
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;

// 1.2.2 To export those functions above we have to write a statement with "module.exports" at the bottom and list all the functions we want to export:
// (Go to [01-start/server.js])
// module.exports = {add, subtract, multiply, divide};