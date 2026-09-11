// 1.2.2 At this file we'll need to put it at the very top.
// (Go to [13-mongodb-mongoose-intro/controllers/authController.js])
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
// ? 1.3.0 But before we do something here we'll need to install "mongoose" package ("npm i mongoose"). It's a library that makes work with MongoDB much easier. There is also a helpful website for that library with extended documentation ("https://mongoosejs.com/"). After that we'll need to import it here.
// 1.3.1 After that we need to create a connection configuration in a file "./config/dbConn.js".
// (Go to [13-mongodb-mongoose-intro/config/dbConn.js])
const mongoose = require("mongoose");
// 1.3.3 We'll also need to import that config here to get it running.
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// 1.3.4 As a very first action we should get up running the connection to MongoDB, because if it fails we don't want to listen for any other connection anyway. ↓
// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({"error": "404 Not Found"});
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

// 1.3.5 Here we also have to make some change, as we don't need to "listen" for requests if we don't connect. So, if our connection fails for whatever reason we need to avoid doing this. From the "mongoose" docs ("Connections events" part of it) we can find out that we can listen to "connected" event, for that we'll use method "connection" with modificator "once", because we want to listen to this event one time, and we'll listen for the open event.
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});