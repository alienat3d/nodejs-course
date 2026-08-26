// ? 9.0.0 In this tutorial we'll organize Node.js & Express.js API server with the MVC (Model View Controller) design pattern. Express.js is by definition an unopinionated framework, and we can organize our project however we would like. We'll demonstrate here MVC because it's a popular pattern.
// ? 9.0.1 First, what we'll do is to rename "data" folder to "model", where the JSON-database is located at. Second, talking about "views" folder, with a RestAPI we won't have many views if hardly one. Maybe we would have a "welcome page" that gives some directions about the API, but that's about it. We won't be really serving a bunch of static pages or resources. What we would need is "controllers" folder and also create a first controller in there.
// (Go to [09-express-mvc/routes/api/employees.js)
// ? 9.4 So, we can now delete the 'subdir' example, as it is not needed inside the API server. We can therefore remove 'subdir.js' from the 'routes' directory, as well as the lines in this file that are connected to it. And we can also delete the "subdir" folder from the "views" folder. The "new-page.html" we won't need either here anymore and also delete the route handlers connected to that from [./routes/root.js] too. And that's quite a bit of clean up but at least we still have the splash page for the index if we want to put some directions for our API there. And we still have the route handler for that in the "root.js" file.
// (Go to [09-express-mvc/controllers/employeesController.js])
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
// 9.3.1 Then we'll need to import CORS options from "corsOptions.js" file. ↑
const corsOptions = require("./config/corsOptions");
const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

// custom logger middleware
app.use(logger);

// 9.3.0 Let's move that "corsOptions" to separate file as well. We'll create a new folder "config" and "corsOptions.js" for that and move the CORS options together with the whitelist there. ↑
// third-party middleware for CORS
app.use(cors(corsOptions));

// built-in middleware for form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for JSON
app.use(express.json());

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
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