// 2.6.1 Here instead of just "fs" we'll write "fsPromises" and we'll attach "promises" to that import.
const fsPromises = require("fs").promises;
const path = require("path");

// 2.6.2 Then we'll create a "fileOps" (file operations) and it'll be async function and inside of it we can use "try...catch" construct.
const fileOps = async () => {
  try {
    // 2.6.4 Here we'll define "data", which will have "fsPromises" through "await" and then attached "readFile" method to it. And we don't need a CB here as we used in 'index.js', because we're using "await" and catching an error in a "catch" block.
    const data = await fsPromises.readFile(path.join(__dirname, "files", "starter.txt"), "utf8");
    console.log(data);

    // 2.6.9 Let's add one more method here, which is "unlink". It deletes the original file that is called "starter.txt". So we'll have a new file "promise-write.txt" with the data "starter.txt" had, but the original file is gone.
    // (Go to [02-write-files/stream.js])
    await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));

    // 2.6.5 And we'll add a "writeFile" method with "await" here. And after that we want to pass in the data that we just read.
    await fsPromises.writeFile(path.join(__dirname, "files", "promise-write.txt"), data);

    // 2.6.6 Next we'll also add a "appendFile" method here, where we add some content to the same file.
    await fsPromises.appendFile(path.join(__dirname, "files", "promise-write.txt"), '\n\nNice to meet you!');

    // 2.6.7 And we'll be also using a "rename" method, changing the name of the file to something else.
    await fsPromises.rename(path.join(__dirname, "files", "promise-write.txt"), path.join(__dirname, "files", "promise-complete.txt"));

    // 2.6.8 At the end of all this, let's log the inside of the new file that we created, updated, and renamed using the above operations. ↑
    const newData = await fsPromises.readFile(path.join(__dirname, "files", "promise-complete.txt"), "utf8");
    console.log(newData);
  } catch (err) {
    // ? 2.6.3 As we're catching here an error there won't be uncaught error.
    console.error(err);
  }
};
fileOps();