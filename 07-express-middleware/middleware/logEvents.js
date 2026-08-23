const {format} = require("date-fns");
const {v4: uuid} = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy.MM.dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  // 7.3.1 We really don't need to change much here except where it writes the logs because we don't want to create a "logs" folder inside the "middleware" folder. So what we need to do is add in one extra spot here and just go one directory up "..". So that way the "logs" directory will be outside the "middleware" directory as it should.
  // (Go to [07-express-middleware/server.js])
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItem);
  } catch (err) {
    console.log(err);
  }
};

// 7.3.6 Let's define a new function "logger" here and paste inside that anonymous function from our custom logger middleware. So now we will be exporting it from here to "server.js".
// (Go to [07-express-middleware/server.js])
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = {logger, logEvents};