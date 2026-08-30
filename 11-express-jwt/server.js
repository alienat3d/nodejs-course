// ? 11.0 In this tutorial we'll add protected routes to our Express.js API by using JWT. But first let's talk about what JWT actually is about. Check the JWT-info file [11-express-jwt/jwt-info.md].
// ? 11.1 Okay, after absorbing some theory let's get back to the practice, and first we'll install all packages that we need for this tutorial: "dotenv", "jsonwebtoken" and "cookie-parser.
// ? 11.1.2 Next, we'll create a new ".env" file at the root level where we'll put environment variables in there. We'll need to create two for now for access token and for refresh token. Then, to generate the tokens we can use built-in Node lib "crypto" and if we'll go to console and type "Node" we'll turn on Node.js mode, then if we'll type in this command we'll get our token: "require('crypto').randomBytes(64).toString('hex')". So we could generate random crypto tokens that way for the values to paste into ".env" file.
// ? 11.1.3 What is also important to do is to make sure the ".env" file is inside the ".gitignore" file, as we don't want to share our secret tokens with the world over GitHub, for example. We'll keep this file for our dev-environment and when we host somewhere they should have a way to put environment variables into their hosting service you can pull those out.
// (Go to [11-express-jwt/controllers/authController.js])
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
// 11.6.1.0 We'll add the "verifyJWT" middleware here... ↓
const verifyJWT = require('./middleware/verifyJWT');
// ? 11.7.0 Next, let's import the "cookie-parser" library. ↓
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// 11.15.1 And then we'll use that middleware here, and it must be used before "cors" middleware because, of course, sees that response header is not set it throws that error in browser.
// (Go to [11-express-jwt/controllers/authController.js])
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// ? 11.7.1 Now, here we'll add that "cookie-parser" middleware for the convenient work with the cookies.
//middleware for cookies
app.use(cookieParser());

// ? 11.8.0 And after that we're ready work on another controller "refreshTokenController" then.
// (Go to [11-express-jwt/controllers/refreshTokenController.js])

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
// 11.10 Here we'll insert the new route to this "server.js" file with among the other routes. But, of course, this route should be before we use "verifyJWT" middleware because the refresh route actually issues a new access token and that's what the "verifyJWT" middleware verifies. Now that "refresh" endpoint will receive the cookie that has the refresh token and then that will issue a new access token once the access token has expired.
app.use('/refresh', require('./routes/refresh'));
// 11.13.1 And we'll add that route here as well. ↓
app.use('/logout', require('./routes/logout'));

// ? 11.11.0 So, it's time for test again. We'll go to [11-express-jwt/http/auth.http] log in once again, but now in addition to access token we'll have a cookie with a refresh token. Now cookie is sent every time to the domain that it's associated with, and we don't need to paste it in an auth area, as we did before with an access token.
// ? 11.11.1 Next, get to the "refresh" route and test it with [11-express-jwt/http/refresh.http]. Here we only use the "GET"-method, it doesn't need anything in it's "body" nor in "auth" because we have the cookie we're going to send. So we just use that "GET"-method and send the cookie inside of it and will get a new access token then. And by now, every time we hit this refresh route, and we send our cookie with the refresh token we should get a new access token, and you can see every time we're getting a different access token over there. So that is what refreshes our access and that's why it's called "refresh token". And so we'll have a new limited time access token to use (in production you might set it to 5 to 15 mins), but then our refresh token has the longer duration that we store in an http-only cookie (that's because we don't want it to be available via JavaScript).
// ? 11.12.0 Now, that we've finished testing the refresh route one extra measure of security or one extra step we can take is to offer a log-out route. And with this route we can actually then delete the refresh token and not let it last for the full duration. That will give to our users the opportunity to log out and delete any existing tokens and, of course, the access token should also be erased on the frontend on log-out link or button is clicked. But we're working on the backend, so we won't be doing that today. So, let's go ahead and create a new controller for the log-out.
// (Go to [11-express-jwt/controllers/logoutController.js])

// ? 11.13.1 And it's time to test our new logout route with [11-express-jwt/http/logout.http] file. Which is just a "GET"-request to "/logout" route which should to log out the user and delete his refresh token too. Here just for the tests in WebStorm we'll add extra lines to [11-express-jwt/http/auth.http] & [11-express-jwt/http/logout.http] files those will store the refresh token in WebStorm's memory ("auth_token") and set its value to "", when we'll log out. Okay, everything is working, but there are a couple nuances I want you to show in this tutorial still.
// (Go to [11-express-jwt/config/allowedOrigins.js])

// 11.6.1.1 ...and then we can use this just like we've used other middleware in our file. But we probably don't want to use "verifyJWT" middleware for all the routes, so we'll add it first before the "employees" route, where we really need verifying token. And once again a reminder note: this works as "a waterfall", so everything what is after this line will use the "verifyJWT" middleware. ↑
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));