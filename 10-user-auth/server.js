// ? 10.0 In this tutorial we'll add user authorization to our Express.js API. We'll start by simulating a user's DB table in "model" directory with the "users.json" file. So, we'll create a "users.json" file and add a couple of users in there with "login" & "password" props. Now, user authorization requires two routes: a registration route to register a new user account and an authorization route to authorize the user after they have created an account. We'll need another two controllers for that.
// (Go to [10-user-auth/controllers/registerController.js])
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
// 10.4 So, here we also need to add this new route for a new user registration.
app.use('/register', require('./routes/register'));
// 10.8 And, of course, for the "auth" route we'll need to add it here too.
app.use('/auth', require('./routes/auth'));
app.use('/employees', require('./routes/api/employees'));

// ? 10.5 Next, we'll go to [10-user-auth/register.http] file and will test the API with that.
// (Go to [10-user-auth/controllers/authController.js])
// ? 10.9 Let's go ahead and test our authorization with the [10-user-auth/auth.http].

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