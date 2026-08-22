const {format} = require("date-fns");
const {v4: uuid} = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// 5.14.3 And we'll add here another parameter the "logName". ↓
const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "dd/MM/yyyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    // 5.14.4 And then we'll use it as a dynamic name for the logs here.
    await fsPromises.appendFile(path.join(__dirname, "logs", logName), logItem);
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;