// ? 2.0 Here we're going to look at the file system common core module for Node.js. It allows us to create, read, update and delete files. And work with directories on the server and that's because Node.js is a JavaScript runtime that actually runs on the server instead of in the browser.
// 2.1.0 Let's start my importing core module for file system "fs":
const fs = require("fs");

// 2.3.0 Instead of hard coding the path like we see here in read file there is a better way. Let's pull in the path module to do that. And the reason is, if you familiar with other OS, that the slashes are sometimes different they're sometimes backwards, sometimes forwards and there can be some problems due that. So with using core module "path" we'll eliminate those possible problems. ↓
const path = require("path");

// 2.1.1 After that we'll read that starter.txt file with "readFile" method, and as a first argument we'll set the path to file inside of it. A second argument shall be a callback-function, that has error and data that we read. Inside of that function we'll say if error occurs we'll throw an error and otherwise log the data to the console. To read the data we also need to add method "toString" to it. However, instead of adding that method we could add encoding type ("utf8" for example) as second argument to the CB-func.
// fs.readFile("./starter.txt", "utf8", (err, data) => {
// 2.3.1 Now we can change the path, using those "path" module. With method join we'll glue together three strings: 1) path to current directory with "__dirname", 2) the directory name and 3) the actual filename. ↓
fs.readFile(path.join(__dirname, "files", "starter.txt"), "utf8", (err, data) => {
  if (err) throw err;
  // console.log(data.toString());
  console.log(data);
});

// ? 2.2 If we'll put here just logging a word, we'll find out that "hello" appears first. It's because Node.js provides two versions for almost all of its built-in features and method "readFile" works as if it was asynchronous, but there is also a method "readFileSync" that makes it work synchronous. We still need async/await (or Promises and Callbacks) in Node.js just as much as we do in browser JavaScript. Node.js functions are asynchronous in how they execute in the background, but JavaScript still needs a way to manage the results of those functions. If we don't use async/await or a Promise, JavaScript won't wait for the background task to finish. ↑
console.log("hello");

// 2.4 Here we'll do something different, we'll copy and paste one file to another and use another method "writeFile" for that. It's pretty similar to formed as the "readFile" we have above, but we won't need to specify that "utf8", as that's by default now. But instead we'll have a string, which will be written in a new text-file. A callback will only have an error now, as we don't need to receive the data, we'll be writing it.
fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Nice to meet you!", (err) => {
  if (err) throw err;
  console.log("Write complete");

  // 2.5.1 It would be better to put the "appendFile" method inside the CB-function of the "writeFile" method if we wanted to modify the file we created, such as "reply.txt," instead of creating this method outside and wondering if it will work after or before "writeFile" method.
  fs.appendFile(path.join(__dirname, "files", "reply.txt"), "\n\nYes it is.", (err) => {
    if (err) throw err;
    console.log("Append complete");

    // 2.5.2 Following the same logic, if we wanted to perform an action on this file after adding more content and ensure it occurred in the correct order, such as renaming the file, then that action would need to be included in the callback of the append file. Then that would need to be in the callback of the append file. For the "rename" method, we'll have to write the path and the new name of the file we want to rename as the second argument.
    // 2.6.0 Although we introduced these methods in the correct order, you might currently think that they all look like "callback hell," and you're right. However, there is a way to avoid that in Node.js as we did in Vanilla JS with Promises. Let's rewrite all of that in 'index2.js'.
    // (Go to [02-write-files/index2.js])
    fs.rename(path.join(__dirname, "files", "reply.txt"), path.join(__dirname, "files", "new-reply.txt"), (err) => {
      if (err) throw err;
      console.log("Rename complete");
    });
  });
});

// 2.5.0 Here is another method "appendFile", which updating a file adding more content to it. Here we'll create a different file to show that "appendFile" will create a file that doesn't exist. So if we run 'index.js' once it'll create a new file 'test.txt' with "Testing text." text in it. But when we run 'index.js' once more it'll add the same text in the same file once again, while "writeFile" method would rewrite it. ↑
/* fs.appendFile(path.join(__dirname, "files", "test.txt"), "Testing text.", (err) => {
  if (err) throw err;
  console.log('Append complete');
}); */

// 2.1.2 According to the Node.js documentation if we get an uncaught exception we need to go ahead and catch that. We listen to this uncaught exception using "process" and it's one of those value that Node.js has available to us, we don't need to import it. We'll pass error in that function and logging it to the terminal console, and then we exit the application. ↑
// exit on uncaught errors
process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
});