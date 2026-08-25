// 8.0 In this tutorial, we'll talk about creating routers in Express.js. And we'll continue from where we left in the last tutorial. In previous tutorials we wrote a lot of code in the "server.js", so it started to look a little messy. What we can do is clean it up and break those routes out into individual routers, which are essentially mini servers for each specific route or "apps". As we create our "app" with "express" method here. We'll create a new directory called "routes" for that. Inside the "routes" directory, there will be routers for each route that we're handling. For example, there will be a "subdir.js" file for the "subdir" directory in the "views" directory.
// (Go to [08-express-routers/routes/subdir.js])
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;
const WHITELIST = ["https://zapl.in/", "http://127.0.0.1:5500", "http://localhost:3500"];

// custom logger middleware
app.use(logger);

// third-party middleware for CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error(`${origin} is not allowed by CORS`), origin);
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));
// built-in middleware for JSON
app.use(express.json());

// ? 8.1.8 By the way, here we didn't pass anything as first argument because it's "/" by default. But we could write it more descriptive. ↓
// app.use(express.static(path.join(__dirname, "/public")));
// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
// 8.1.7 After testing the new router, we found that the CSS stylesheet isn't loading for the "subdir" directory. To resolve this, we need to add another line to serve static files for the "subdir" directory. ↑
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// 8.2.0 Next we'll create a route for the root.
// (Go to [08-express-routers/routes/root.js])
// routes
app.use("/", require("./routes/root"));
// 8.1.6 Now that we have the first router file, we'll provide it here with "app.use" underneath where we serve the static files. Then, we'll write the directory path for that routing and, as the second argument, import the route that will handle it. And now this will route any request coming for the subdirectory to the router. ↑
app.use("/subdir", require("./routes/subdir"));

// 8.3.0 Now, with routes working correctly let's talk about how we would set up an API (or a RestAPI). And that's more important when we're working with MERN (MongoDB, Express.js, React, Node.js) stack. Or we could substitute any other Database/Frontend technology, but we've Node.js + Express.js here. And we want to organize an API is what we most likely will create with Node.js & Express.js compared to a static server for web pages, although we can do that too. So let's focus on that here and underneath other routes we'll add one more route. And we'll add an extra subdirectory "api" to store API-routes there.
// (Go to [08-express-routers/routes/api/employees.js])
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      error: "404 - Not Found",
    });
  } else {
    res.type("txt").send("404 - Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running is on port: ${PORT}`));