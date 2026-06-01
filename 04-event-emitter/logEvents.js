// ? 4.0 Here it'll be about events common core module in Node.js. We'll learn about how to both emit custom events and how to respond to those events when they're emitted. Right now we're picking up where we left off in the last tutorial about npm modules.
// 4.1 Let's name this file "logEvents", because we're going to make this into a module that we import into an 'index.js'.
const {format} = require("date-fns");
const {v4: uuid} = require("uuid");
// 4.2.0 So, we'll create here a logging function, as logging events is something very useful on a server. And we'll need to import also a "fs" core module to be able to work with file system.
const fs = require("fs");
// 4.2.1 We're also going to use Promises.
const fsPromises = require("fs").promises;
// 4.2.2 And we'll also need "path" module here as well.
const path = require("path");

// 4.3.0 Here, we will create an asynchronous logging events function. Inside the function, we'll define a "dateTime" variable to which we'll assign the date and time format created with the "date-fns" module. Next, we'll create another variable called "logItem" and use it to generate a log message with the "dateTime" variable. Then, we'll use the "uuid" library to generate a unique ID and log it to the console.
// 4.3.1 Then, we'll need a "try...catch" block with an "appendFile" method from "fsPromises" and the "await" keyword. This will add a new "logItem" to "eventLog.txt" each time it runs.
// 4.5 Oops we got an error there. It seems we forgot to check if the "log" directory exists. The "appendFile" method creates a file if it doesn't exist, but it won't create directory. We have to think about creating one if it doesn't exist.
// ? 4.6 And this is how we set up an emitter to not listen for, but to emit events. There might be all sorts of actions that we would want to emit events for. When we create a web server we want to emit events to show what requests came in and log all of those, so we have some detail of the activity for web server. That's what we be building in next lessons.
const logEvents = async (message) => {
  const dateTime = `${format(new Date(), "dd/MM/yyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(path.join(__dirname, "logs", "eventLog.txt"), logItem);
  } catch (err) {
    console.error(err);
  }
};

//4.3.2 Then we'll be exporting that function with "module.exports", so we can use it in the 'index.js' file:
// (Go to [04-event-emitter/index.js])
module.exports = logEvents;