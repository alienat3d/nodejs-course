// ? 7.0.0 Let's talk about «middleware» in Express.js here and we'll start out from the code we've written at last tutorial. So what is «middleware» — it's really anything between the request and response. So the route handlers we created in the last tutorial are really middleware too. There are three types of middleware: built-in middleware, custom middleware and middleware from third parties. Of course, custom middlewares is what we're writing ourselves.
const express = require("express");
const app = express();
const path = require("path");

// 7.4.0 Let's add a third part middleware now, and it'll be "cors" (stands for "cross-origin resource sharing"). First we'll install it from NPM and then import to this file. ↓
const cors = require("cors");

// 7.3.2 We'll also need to import "logEvents" file here to use the writing logs to file functionality here. ↓
// const logEvents = require("./middleware/logEvents");
// 7.3.7.0 Now we'll be exporting just that "logger" function... ↓
const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// 7.2.0 Okay, let's create a custom middleware now that is written by ourselves. It will be a custom logger middleware, and we want to create it before anything else because if we put it after "static" middleware, for example, we wouldn't log the request for CSS, images or anything like that. So if we put it at the very top then we'll see the requests for everything as they come through. Inside the method "use" we'll put an anonymous function that gets request, response and since we're creating this it needs to have also "next" parameter, so we could move on.
// custom middleware logger
/* app.use((req, res, next) => {
  // 7.3.3 So now we can use log events here inside custom middleware logger, and it accepts two parameters: message and file, that it should write to or create. As the message we'll put in request method, then tab, then request "headers.origin" which should be saying where the request is coming from (what website sent it to us), then tab again and finally what url was requested. As a log filename let's name it "reqLog" (for request log).
  // ? 7.3.4 Good, our logger is working and writes the logs, and it's fine that the "headers.origin" returns "undefined" so far, as we're working not with the real website but running a local server yet. ↓
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');

  // 7.2.1 Inside the function we'll log the method and path from request.
  console.log(`${req.method} ${req.path}`);

  next();
  // ? 7.2.2 Well, logging to the console is okay for our custom middleware logger, but what we're really want to do is create a log file, and we've already created a log events function back when we were working with server on Node.js. So we can take it and use here.
  // ? 7.3.0 Let's create a new folder "middleware" and copy-paste the "logEvents.js" file with log events function to that directory.
  // (Go to [07-express-middleware/middleware/logEvents.js])
}); */

// 7.3.5 Well, we can clean this up a little bit in that we can actually move the anonymous function to the logEvents.js, where it logically makes more sense to be.
// (Go to [07-express-middleware/middleware/logEvents.js])
// 7.3.7.1 ... and then we'll use it inside the "use" method as custom logger middleware. ↑
app.use(logger);

// 7.4.1 We have to apply the third-party middleware "cors" ASAP. The place right after our custom middleware should be okay. So, now we can request data from another domain without getting a CORS-error.
// ? 7.4.2 We won't get here deep into "CORS" topic, but is good to know that CORS (Cross-Origin Resource Sharing) is a browser security feature that controls how web applications running on one domain (origin) can request resources hosted on a different domain. An origin is defined by three components: Protocol + Domain + Port (e.g., [https://myapp.com:443](https://myapp.com:443)). If any of these three elements differ between the requesting app and the server, the request is considered cross-origin.
// 7.4.3 In short, this third-party middleware should be used if we want the server to be open as a public API. However, that's not what we want for many applications. So, let's create a whitelist that lists the allowed domains in an array. Any web app domain that accesses this backend node server must be written in that array.
// 7.4.4 However, we may also have a variation without 'www.'. Perhaps we're working on a local development server and launching from the 'Go live' functionality of the local server installation. In this case, it runs on 'http://127.0.0.1:5500' (for example, if we're building an app using a framework and running it on a local development server). Of course, we'll also need the 'http://localhost:3500' that we're using here today. Once the development phase is over and the app is in production, you would delete those local development server domains from here.
// 7.4.5 So we've created a list that is allowed to access our server backend that CORS will not prevent. So now we need to create the function that will allow CORS to do this and this is all contained within the CORS options. Inside that function there will be a property "origin" with a function as value that accepts two parameters: "origin" — which is in that case will be the origin coming from whoever requested it and "callback" function.
const corsOptions = {
  origin: (origin, callback) => {
    // 7.4.6 Then inside we'll create an if-statement, that means "if the domain is in the whitelist" then we'll go ahead and let it pass.
    // 7.5.3 During development we have to make one modification to this if-statement and add "|| !origin", which would mean "the equivalent of 'undefined'" in this case. Once again, it needs to be here only during development and before the rolling out to the production we've to remove this part of the if statement. ↓
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // 7.4.7 Then we'll call the "callback" and it's first argument will be null (which is usually an error) and second one will be boolean value "true" (means that the origin will be sent back, saying "yes, that's the same origin, and it's allowed").
      callback(null, origin);
    } else {
      // 7.4.8 And inside the "else-block" we'll also call the "callback", but instead of "null" it will be an error constructor creating an error with a text that says that's domain is not allowed by CORS.
      // 7.5.0 And we can handle errors, of course, although Express.js is already handling them. It has the built-in error handler by default. And that's what's happening, when we throw this error here. However, let's add a little custom error handler, and we'll do that at the very bottom of the code. ↓
      callback(new Error(`${origin} is not allowed by CORS`), origin);
    }
  },
  // 7.4.9 We also need to add another property to the options here which name is "optionsSuccessStatus". And it will send status 200.
  optionsSuccessStatus: 200,
};
const whitelist = ["https://zapl.in/", "http://127.0.0.1:5500", "http://localhost:3500"];

// 7.4.10 So, now we're ready to pass those "corsOptions" object into method "cors".
app.use(cors(corsOptions));

// ? 7.4.11 Let's make a test and go first to https://zapl.in/ website (which is inside our whitelist) and run "fetch("http://localhost:3500/");" from browser console to get access to the local server. Then, we can run 'fetch("http://localhost:3500/")' from the browser console to access the local server. Then, we can go to https://www.google.com/ (which isn't in the whitelist) and do the same. In the first case, we'll receive "/GET" in the Node console, and a new record will appear in reqLog.txt. This means that the website has access to our server. In the second case, we'll receive an error, which means that www.google.com didn't have access to our server. ↑

// ? 7.1.0 Let's start with "built-in middleware". And here we can see method "use" and is what we use to apply middleware to all routes that are coming in and of course just like our HTTP-methods "get", "post", "delete", "put" etc. This all works as a waterfall. So if we put "app.use" above our routes, then this will apply to all routes that come in.
// ? 7.1.1 So what is this particular middleware for? It's for handling URL encoded data, in other words "form data" ("content-type: application/x-www-form-urlencoded"). So when that comes in the URL, then we can pull the data out as a parameter. So we need to add this middleware that is built-in into Express.js in order to get that data when form data is submitted.
// built-in middleware for form data
app.use(express.urlencoded({extended: false}));

// ? 7.1.2 Now we'll add additional layer of middleware and this is for JSON. So if the JSON data is submitted we need to get those parameters of that data out of submission, and we use this middleware to do that. And now this is applied to all routes as it comes in.
// built-in middleware for JSON
app.use(express.json());

// ? 7.1.3 Another middleware is needed to serve static files. This is important because if you remember from last tutorial, we're not yet applying CSS, we have a broke image in our "new-page" page and files that should be available to the public were not available. So we'll use "static" middleware method and supply a path to the public folder with the files we want to provide by the server. ↑
// built-in middleware to serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

app.get("/hello(.html)?", (req, res, next) => {
  console.log("Attempted to load hello.html");
  next();
}, (req, res) => {
  res.send("Hello World!");
});

const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("Finished!");
};

app.get("/chain(.html)?", [one, two, three]);

// 7.6.0 Okay, it's the last thing to do for this tutorial here — to compare methods "app.use" & "app.all". And that's what we're going to do right here as we change up the 404 just a little bit. We could use something like this and specify here at the end of the chain everything basically that came in from the "/" which would be the root, but "app.use" doesn't accept RegEx and also "app.use" overall is more likely to be used for middleware, but "app.all" is used for routing and this means it will apply to all HTTP-methods, and it also does accept RegEx.
/* app.get("/!*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
}); */
app.all("*", (req, res) => {
  // 7.6.1 So inside the function we also can do some tuning up a bit. First, we'll set status code 404, as we know it will be 404 no matter what.
  res.status(404);

  // 7.6.2 Then, let's check the type with method "accepts" and we'll be looking for content type 'html' and Express.js will translate that for us. That condition will return boolean. So if it's truthy we'll be sending file with Error 404 page. And, okay, it's pretty much like we were already doing before, but then we can check for other types as well that might be accepted.
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    // 7.6.3 And if the request accepts "json" then we won't send file at all, we'll use method "json" and we can put JSON inside of that response.
    res.json({
      error: "404 - Not Found",
    });
    // 7.6.4 For last possible outcome here, and we can set type to "text" and then chaining it with "send" and we put inside "send" method the same text, as above.
  } else {
    res.type("txt").send("404 - Not Found");
  }
});

// 7.5.1 Here, before method "listen" is the perfect sport for our custom error handler. And we'll use "app.use" once again and inside of it will be an anonymous function and besides "req", "res" and "next" it also receives "err" parameter for the error object. And then we'll log to the console the error stack or just a message or whatever. We'll send status code 500 ("server error") and then we can send an error message to be displayed in the browser.
// ? 7.5.4 And we can also tidy up that custom error. Let's cut that function out and move it to a new file "errorHandler.js" inside the "middleware" folder.
// (Go to [07-express-middleware/middleware/errorHandler.js])
// 7.5.6 So, we'll import "errorHandle" utility here and pass in "use" method. ↑
app.use(errorHandler);

// ? 7.5.2 Now, after we finished our custom error handler and if we go to the browser to test it and just go to the index page, for example, we'll see the error message on the page instead of the index page. Well, now we know that our custom error handler did work, but let's find out why this is happening even on index page. Well, if we go to [./07-express-middleware/logs/reqLog.txt] and check the log file we'll see, that the origin website name is stated as "undefined" there. And this where the problem is hiding — "undefined" is not in the whitelist, so we get that error. ↑

app.listen(PORT, () => console.log(`Server running is on port: ${PORT}`));