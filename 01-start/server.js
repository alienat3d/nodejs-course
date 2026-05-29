// 1.0 Let's cover "global" into console.log function and see what's inside, because "global" is the key for the global object.
// console.log(global);
// (Go to [notes.md])
// 1.1.0 Example of CommonJS imports and some core modules in Node.js:
const os = require("os");
const path = require("path");

// 1.2.0 Besides the core modules we can, of course, also pull in packages that other developers have created. But we could also create our own modules. Let's create first another JS-file and go there.
// (Go to [01-start/math.js])
// 1.2.3 Now here we can import the functions from that "math" file.
// const math = require("./math");

// 1.2.4 Then we can run one of the functions "add" from that file we exported.
// console.log(math.add(5, 7));

// 1.2.5 Or we could actually destructure all functions instantly to make code cleaner.
const {add, subtract, multiply, divide} = require("./math");

// 1.2.6 Then we'll run functions like that:
// (Go to [01-start/math.js])
console.log(add(10, 20));
console.log(subtract(10, 20));
console.log(multiply(10, 20));
console.log(divide(10, 20));

// 1.1.1 Let's use that "os" to show some info in terminal console.
/* console.log(os.type()); // OS type
console.log(os.version()); // OS version
console.log(os.homedir()); // home directory */

// 1.1.2 There are a couple of values we've always can use in Node.js:
/* console.log(__dirname); // returns a directory name we're currently in
console.log(__filename); // returns a file name we're using */

// 1.1.3 Let's use the second core module "path" with its method "dirname", where we pass in "__filename" and see it's pretty much the same what we've already got by using "console.log(__dirname);" above. ↑
/* console.log(path.dirname(__filename)); // returns a directory name we're currently in
console.log(path.basename(__filename)); // returns the name of the current file
console.log(path.extname(__filename)); // returns the extension name
console.log(path.parse(__filename)); // returns an object with all of those values above */

