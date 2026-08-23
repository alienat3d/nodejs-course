const { logEvents } = require('./logEvents');

// ? 7.5.5 After we moved the functionality of our custom error handler here, it would also be useful to create an error log with our utility, "logEvents," which we've already created. We'll import that function and use it to create a log file for errors that might occur. The dynamically formed message will contain the name of the error and the error message, as well as the file into which the logs should be written.
// (Go to [07-express-middleware/server.js])
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;