// 2.7.0 Now, if we have larger files sometimes it's good to not grab all the data at once it could be too much. Just like moving a huge pile of sand bucket by bucket is better, rather than attempting to move all at once. So our app can be more efficient if we do these. And here we also need "fs" module.
const fs = require("fs");
const path = require("path");

// 2.7.1 Then we'll create "rs", which will contains "fs" with added "createReadStream" to it. Inside of that we'll add a path to the large text file as the first argument, which is "lorem.txt". The second argument will be the options with encoding type. We've created by that a readable stream and specified encoding of it.
const rs = fs.createReadStream(path.join(__dirname, "files", "lorem.txt"), {encoding: "utf8"});

// 2.7.2 Next we'll specify a writable stream with "createWriteStream" method. Let's give it a new name and we don't need to specify encoding here.
const ws = fs.createWriteStream(path.join(__dirname, "files", "new-lorem.txt"));

// 2.7.3 Now, we will listen for data coming in from the stream using the "on" method. The first argument will be what we're listening to, so it's "data," and the second argument is a CB function that will have a data chunk parameter. Inside, we can do something with the data chunk. For example, we can use console.log or write it to a new file with the "write" method of the writable stream "ws". Okay, that was ultra-fast because it's a test file. In practice, though, it might be a larger file, and in that case, this approach is much more efficient.
/*rs.on("data", (dataChunk) => {
  ws.write(dataChunk);
});*/

// 2.7.4 But speaking of efficiency there is still a better way to do this. Instead of the listener we can use "pipe" on readable stream and then pass in a writable stream. It'll accomplish the same thing and piping is more efficient than the listener above.
// (Go to [02-write-files/dir.js])
rs.pipe(ws);