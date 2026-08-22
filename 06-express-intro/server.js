// ? 6.0.0 This is the file where we'll make most changes. We don't need most of what's here since we're using "Express.js". First of all we'll import «Express.js».
const express = require("express");

// 6.0.1 Next we'll call the "express" function to the "app" variable (which is typical name for «Express.js» instance, although we could also use other name like "server" for example if we want).
const app = express();

const path = require("path");
const PORT = process.env.PORT || 3500;

// 6.1.0 Now let's define our first route. We'll specify the HTTP-method that we want to route. We'll use GET-method here. In that "get" method as the first argument we look for root, and it will be our "index" page. Then as second argument we'll specify what to do with that, it's going to be a function that gets as parameters "req" & "res" (request & response) and what we do with the route it happens inside of that function and call "send" method on response object and put in a string "Hello World!" and that will be sent as response. After we start the server we will expect to get this at the index page.
// 6.1.1 So, let's go ahead and start the server by starting nodemon with "npm run dev" command, so nodemon knows to restart anytime we make changes.
// 6.1.5 But what if someone types "website.com/index.html"? And this is where Express.js is really helps us out, because it also accepts regular expressions in the routing. So we could upgrade that first argument with the path to regular expression that will say: 'it must begin with the "/" and it must end with "/" or be "/index(.html)?" (where (.html)? means it's optional and can be with extension or not)'. ↓
app.get("^/$|/index(.html)?", (req, res) => {
  // res.send("Hello World");
  // 6.1.2 All right, it worked well. We see the words "Hello World" on the blank page. Now, we can ask the server to send the "index.html" file instead. We'll need to use the sendFile method for that. Inside the sendFile method, there are a couple of ways to specify the file to send in Express.js. The first way is to put the path in as the first argument and specify the options as the second argument. One of the options will be the root directory.
  // res.sendFile("./views/index.html", {root: __dirname});
  // 6.1.3 Another way is what we were already doing in Node.js in the last lesson. We'll use the "path.join" method and pass in "__dirname", the directory where the file is, and the name of the file we need to serve. Both variants are good, and it's a matter of preference which you use.
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 6.1.4 Let's do the same about other pages and copy-paste the previous block of code, but change the argument to another piece of URL, that leads to "new-page" page and also change the filename at "sendFile" method here to provide the HTML-file for "new-page" page. ↑
app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// ? 6.2 It's also worth mentioning that, unlike in Node.js, where we wrote a considerable amount of code to handle things like status codes and content types in the "Node.js-only web server" from the last lesson (see [05-web-server/server.js]), Express.js automatically sets the correct status codes and content types. For example, for error 404, it will recognize and set 404, and likewise, if it finds HTML on a server, it will set the appropriate 200 status code and content type for HTML files.

// 6.3 In the previous lesson, we covered redirects on the Node.js server. Now, let's do the same with the Express.js server. We'll say that if we request the "old-page", we want to redirect to the "new-page". With Express.js, it's very simple. We'll just use the "redirect" method and specify the page to which we want to redirect. But it's one thing missing — the status code. Now one will be sent by Express.js, but it's 302 by default. And 302 will not necessarily get the search engine to change saying it is a permanent redirect and what we really want is actually 301. So we could specify the status code before the URL inside the "redirect" method.
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

// 6.5.0 Now, let's also talk about the "route handlers". Those anonymous arrow functions, that we've been writing inside the "get" method as the second argument right after "url" are "route handlers". And we actually can chain those or use more that one of those. Let's see it on example. We'll start writing the "get" method, as we did above, but then the anonymous function will have third parameter "next".
app.get("/hello(.html)?", (req, res, next) => {
  // 6.5.1 Then we'll do something inside of that function that should to be done and after that we'll call "next". What it does is it moves on to the next handler or the next function expression. You probably won't see that often, but sometimes it can be useful.
  console.log("Attempted to load hello.html");
  next();
  // 6.5.2 Then, after "}," there will be another anonymous function those can have "next" parameter again if we are about to chain in another function and so on (but we'll stop on that now).
  // ? 6.5.3 This way we make both functions to work one after another, when user request "website.com/hello.html" or "website.com/hello".
}, (req, res) => {
  res.send("Hello World!");
});

// 6.6.0 But let's have a look at another way functions chained together and this way you would probably see it more often. Let's write the very basic functions here as an example:
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

// 6.6.1 And this is how we'll use that chain of functions inside the "get" method. As second argument we'll provide an array, where we'll list all the chained functions in that order they're appeared in code. ↓
app.get("/chain(.html)?", [one, two, three]);

// 6.4 In the end, we can create a "catch-all" route for cases when none of the above routes fit. So this will lead users to the custom "Error 404" page, but what it won't do is sending 404 status code, because it will find the HTML-file to send, it will be status code 200. And what we can do to fix that is chain in the status code here with the "status" method. ↑
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// ? 6.7 And those "route handlers" we just saw work in a way that very similar to what we would call «middleware». And middleware is what we'll be covering in next lesson.

app.listen(PORT, () => console.log(`Server running is on port: ${PORT}`));