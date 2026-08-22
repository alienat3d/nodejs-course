// ? 5.0 Here we'll be building a web server with Node.js, no frameworks will be utilized for learning more foundational knowledge about Node.js.
// ? 5.1 We used the same structure and scripts as in the previous lesson. However, we renamed the file "index.js" to "server.js" and updated the "scripts" object in the "package.json" file accordingly. We also added some folders and files to this project are simply to be served by the server, so we can make sure it's working. We've "style.css" in "css" folder, "data.json" with "data.txt" in a "data" folder, a pic at "img" folder and in a "views" folder we've got a couple of HTML-pages: "404", "index" and "new-page". Also, it's a "subdir" directory inside of it with another "index.html" file in it.
// 5.2 So, let's add here another core module "http" and also we'll need modules "path" and "fs" here as well. As well as "fsPromises".
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");

class Emitter extends EventEmitter {
}

const myEmitter = new Emitter();

// 5.14.2 Here we'll be listening for a log, but instead of just a message we'll also have a filename passed in.
// (Go to [05-web-server/logEvents.js])
myEmitter.on("log", (message, fileName) => logEvents(message, fileName));

// 5.3.0 Now we'll need to define a port for our web server, because if we were to host it somewhere it would use this info, and we can say or 3500. And if we would host it somewhere it would have a different port value here.
const PORT = process.env.PORT || 3500;

// 5.9.0 Now we need to create an async function to serve file. This function would have three arguments: one for path to file, second to define the content type and third will be a response object to send that response. (Note that we call the parameter with the full word "response" before we're sending "res" into "createServer" method below to run the server.)
const serveFile = async (filePath, contentType, response) => {
  // 5.9.1 We'll need a "try...catch" construction here to catch possible errors.
  try {
    // 5.9.3 In a "try block" let's get the data from the file with "await" and we'll use "fsPromises.readFile" method to read the file.
    // 5.11.0 Now, let's review the previous code to identify and resolve the listed issues, starting with the server serving JSON files. First, we'll rename the "data" variable to "rawData", and then we'll define the data separately.
    // const data = await fsPromises.readFile(filePath, "utf8");
    // 5.12 However, we still have a new page with a broken image that needs to be fixed. This is happening because the image is not using "utf-8" encoding. To fix this, we'll need to write a statement that, if the content type doesn't include the word "image" (which it does for each image type), the encoding should be "utf-8"; otherwise, it should be an empty string, which is expected in that spot. In that case, we won't specify the encoding for the images. ↓
    const rawData = await fsPromises.readFile(filePath, !contentType.includes("image") ? "utf8" : "");
    // 5.11.1 We'll use a ternary statement to parse JSON with the "JSON.parse" method if the content type is "application/json" and return the raw data otherwise.
    const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;
    // 5.9.4 Then we'll use method "writeHead" to create headers with a content type, that were created and stored in "contentType".
    // response.writeHead(200, {"Content-Type": contentType});
    // 5.13 Okay, that's great, but there's one more thing we need to fix. Have you thought about the fact that we're sending a status 200 even when it's a 404? The 404 is processed here as well. We need to check that we don't send a 200 if it's a 404. Let's add a statement that if the file path includes "404.html", then the response code should be 404; otherwise, it should be 200. ↓
    response.writeHead(
      filePath.includes("404.html") ? 404 : 200,
      {"Content-Type": contentType},
    );

    // 5.9.5 And finally we'll have method "end" called to send data back. ↓
    // response.end(data);
    // 5.11.2 Similarly, when we send the response, we'll use the ternary statement again to check the content type. If it's "application/json", we'll call the "JSON.stringify" method on the "data" variable. Otherwise, it should just return the data.
    // ? 5.11.3 After a couple of manipulations, the server will serve us a true JSON file now. ↑
    response.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (err) {
    // 5.9.2 Let's start with the second error-block, and here we'll log the error to the console in there. Also, we'll be setting statusCode of response to 500 "server error", that means we couldn't read the data from the server that we want. Then we'll end the response. ↑
    console.log(err);
    // 5.14.1 We'll put an emitter up in the error where we were catching a server error. Here, however, we'll log something different: the name and message of the error. We'll save it in a different file than the other log, obviously. ↑
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errorLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

// 5.3.1 Let's go ahead and create the minimal server. We can do that with "http" module's method "createServer", that will get as a parameter an anonymous arrow function with parameters "req" ("request") and "res" ("response"). Inside of that function we'll only put a logging to the console request URL and method.
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  // 5.14.0 Okay, we're almost finished here. We have all the files with the correct content type headers, but we haven't logged anything yet. Let's work on that too. We're going to log here right after "console.log()." First, we'll log the request URL and the tab character, then the request method. Then, there will be another parameter for a log event handler where we'll specify the file to which we want to add the log. We'll use "reqLog.txt" as the file name. Let's copy that line to bring it to another place, where it also needs to be. ↑
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  // 5.4.0 Let's do here on a server something else than just a logging url & method. We could build a path and serve a file.
  // let pathFile;

  // 5.4.1 Inside of if statement we'll check if url either "/" or "index.html" and if so we'll set the statusCode to 200, which means "successful", we'll set the response header content type (it's "text/html", as we'll be serving an HTML-page). Then we'll define a path to file to serve from "views" folder.
  // ? 5.4.3 Well, those would work, but it's not efficient. We would have a statement for every address that came in, and actually every file, as we'll be serving files that are not text/html.
  /*  if (req.url === "/" || req.url === "index.html") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      pathFile = path.join(__dirname, "views", "index.html");
      // 5.4.2 And then to serve that page we'll use method "readFile" of global object "fs" (that stands for "file system" to not forget). And for arguments of that method we'll pass the path of the file, the standard "utf8" coding format and a callback, which has two parameters: one for error (not handling yet here) and another for the data to serve the page. ↑
      fs.readFile(pathFile, "utf8", (err, data) => {
        res.end(data);
      });
    } */

  // ? 5.5 Let's see another version of simple server, that we won't use, but as an example of possible alternative that can be. So we can put in a "switch case" statement and use a URL-request that comes in and then if it's a "/" we'll do all the same, as in a block of code above. However, it has the same problem as the example above in that it's not dynamic and will take up a lot of space.
  /* switch (req.url) {
    case "/":
      res.statusCode = 200;
      pathFile = path.join(__dirname, "views", "index.html");
      fs.readFile(pathFile, "utf8", (err, data) => {
        res.end(data);
      });
      break;
  } */

  // 5.6.0 So, let's finally move on to the solution we want to use today. We'll look at the extension of the request URL that we get, and so we use the "path.extname" method to get that extension. Once again, if it's "/" then there will not be an extension name, so we have to handle that as well.
  const extension = path.extname(req.url);

  // 5.6.1 We'll also need to define a content type, and we'll use a "switch case" statement to set the content type, because there are several options. And we'll do that for every each type of file we expect to be requested from the server. (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types)
  // 5.6.2 It's also important to note that the default case should return "text/html" since the URL could be "/". ↓
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg" || ".jpeg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
    case ".webp":
      contentType = "image/webp";
      break;
    case ".avif":
      contentType = "image/avif";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    case ".pdf":
      contentType = "application/pdf";
      break;
    default:
      contentType = "text/html";
  }

  // 5.6.3 Okay for the next part we'll use the chain ternary statements to set the value of the path to file. It can be confusing at start, but let's break it down: we'll say here if contentType "text/html" and the URL is "/" then we'll be searching for "index.html" inside the "views" folder and for the full path to the project we'll use "__dirname".
  // 5.6.4 Well, if it's not the case, then we'll say we're searching for content type "text/html" and the last character of URL (we get it via "slice" method) is a "/". And this accounts to the subdirectory possibly and not just the main directory and so this will be a little different, because we need to refer to not only "views" folder, but also need "req.url" that would specify the subdirectory and only then we'll serve the "index.html" file from there.
  // 5.6.5 And if it's still not the case we'll be checking if content type is "text/html" and then we would look at whatever was requested in the "views" folder, because that's where the HTML-files should be. However, if it's not the case we'll be just using the directory name and the file path from the request, because this could be CSS or an image or something else in one of the other folders that would be specified in the request URL.
  // ? 5.6.6 Another way to break it down: everything that starts with "contentType" is a conditional statement and everything that starts with "path.join" method is a result, that returns if the previous statement above is truthy. And the final (the lowest) "path.join" is the default result if none of the statements were truthy.
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
        ? path.join(__dirname, "views", req.url, "index.html")
        : contentType === "text/html"
          ? path.join(__dirname, "views", req.url)
          : path.join(__dirname, req.url);

  // 5.7 Let's add another "if statement" here for the file path. We'll say if there is no extension, which means it was probably "/" and didn't have a file extension and the last character of the request URL isn't "/". So maybe we've just requested a file like "about" or "new-page", but didn't type ".html" afterward this will make that work anyway, and it's good to do (although not necessary required).
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  // 5.8.0 Next we want to check and see if file exists, and we ready to serve the file. That method will return boolean value as result.
  const fileExists = fs.existsSync(filePath);

  // 5.8.1 Then we'll use that boolean value for if statement to serve file and if it's falsy we'll have 404 or 301 (which means redirection).
  if (fileExists) {
    // serve the file
    // 5.9.6 Here is the first place where we have to call our "serveFile" function. ↓
    serveFile(filePath, contentType, res);
  } else {
    // 404
    // 301 redirect
    // 5.8.2 For now let's log to the console the call of "path.parse" method that will tell us the different parts of the file path.
    // console.log(path.parse(filePath));
    // 5.8.3 By running the server with "npm run dev" and requesting a non-existent page, we can see the "filePath" in the console and determine what we need. In this case, it's the "base" property, which gives the name of the file with an extension, i.e., "page-name.html". Let's create a "switch case" statement.
    switch (path.parse(filePath).base) {
      // 5.8.4 The first case will be "old-page.html", which we want to redirect to "new-page.html".
      case "old-page.html":
        res.writeHead(301, {"Location": "/new-page.html"});
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, {"Location": "/"});
        res.end();
        break;
      // 5.8.5 There are could be more redirects if it needs, of course, but the default should be "404". ↑
      default:
        // server 404 respons
        // 5.9.7 Here's another place where we wanted to call the function to serve the file. Let's change "filePath" to "path.join" method here, though. Since we know exactly where it is, we'll need to set the direct path to the 404 error page. And we actually know the exact content type, so let's change that to 'text/html'. ↓
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

// ? 5.10.0 Okay, the tests show that our little server is serving files properly. However, there are still some issues with specific files. For example, entering "./data/data.txt" into the browser's address bar seems to work fine, and the requested text file appears. But what if we request a JSON file? It returns text, not a JSON file. It looks like it could be parsed, but it's not the format we want to send.
// ? 5.10.1 Also, there should be an image on the "new-page" page, but the image doesn't work either.
// ? 5.10.2 However, the redirect from "old-page" to "new-page" works as it should. If we go to the subdirectory, we'll see its index page as well. The same goes for the test page. ↑

// 5.3.2 We're not quite ready to launch our server yet, because it still needs to listen for requests with "listen" method. And this should always be at the end of "server.js" file. It has as 1st parameter a port value and as 2nd arrow function, where we put logging in console the port server is running currently on.
// ? 5.3.3 When we run "npm run dev" in Terminal, the "server.js" file will run, and we should see "Server running on port: 3500", which means our server is up and running on port 3500. When we go to the browser and type in "http://localhost:3500/", we'll see "/ GET" in the terminal console. This means that our server is working properly and logging what we told it to log earlier "url" and "method" of the request. ↑
server.listen(PORT, () => console.log(`Server running is on port: ${PORT}`));