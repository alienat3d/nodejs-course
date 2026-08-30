const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

// 11.2.0 First, we'll pull in everything we will require here for this tutorial: "JWT", "dotenv", "fs" and "path". ↓
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const {user, pwd} = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
  const foundUser = usersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // 11.2.1 And we're up to implement JWT here and add security tokens to our API with it. Starting with defining an access token. And for that we'll use "sign" method from "jwt" library which accepts as the first argument a payload. We will use the username object here as you don't want to pass in anything like a password or anything that would otherwise hurt your security because it's available to all if they get a hold of your token. And that's why we'll be using here just username. We'll set as payload an object with a property "username" and assign the "username" property value from "foundUser", the user that we got above from the request body. Next thing what we need to define the access token is our secret token that we defined in the [11-express-jwt/.env] file. And we'll access that via "process.env.NAME_OF_THE_RECORD" command. And finally what we'll need is an options value here. There we can say when this toke expires. Let's make it very short while we at development phase, but for production you would like to make it 5 to 15 minutes usually.
    // create JWTs
    const accessToken = jwt.sign(
      {"username": foundUser.username},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "30s"},
    );
    // 11.2.2 And we also need to create a refresh token too. And it's pretty much the same, as the previous token, but we'll refer to "REFRESH_TOKEN_SECRET" instead and a refresh token needs to last much longer than access token, so let's set it to 1 day. And after that we want it to expire and then our users have to log back in. Well, we could make an indefinite refresh token, but that means if someone gets a hold on it, and they're not correct person they will always have access, and we don't want that.
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: "1d"},
    );

    // 11.2.3 We also want to save our refresh token in the DB which will also allow us to create a logout route in the future that will allow us to invalidate the refresh token when a user logs out. So that will create an array of the other users that are not the username that is logged in.
    // saving refresh token with current user
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);

    // 11.2.4 And we'll create a "currentUser" object, where we'll spread inside an object "foundUser" together with "refreshToken".
    const currentUser = {...foundUser, refreshToken};

    // 11.2.5 Then, let's set our users once again. We'll create a new array made of "otherUsers" and also "currentUser".
    usersDB.setUsers([...otherUsers, currentUser]);

    // 11.2.6 And let's write our new users file with built-in "fs" library, and it's method "writeFile".
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users));


    // 11.2.8 After that with the refresh token what we're going to do is to save it as HTTP-only cookie, which is not available to JavaScript. We can do that with the "cookie" method, where as the first argument we'll give a cookie a name ("jwt" fits here), as the second will be refreshToken to write as a cooke and the third argument will be the options object, where we'll have "httpOnly" option set to true. Then, the "maxAge" option will be set to 24 hours. Now cookie is always sent with every request, but the nice thing with "httpOnly" option is that it makes it not available to JavaScript. It's not 100% secure, but it's much more secure, than storing it in local storage or in a cookie without that option. And we're also storing this refreshToken above in the DB in "currentUser" that can be cross-referenced when it sent back to create another access token.
    // (Go to [11-express-jwt/middleware/verifyJWT.js])
    // 11.16.0 As we wrap up this tutorial, we’ve come to the conclusion that you must set the “sameSite” and “secure” options for cookies; otherwise, an error will occur in the browser.
    // (Go to [11-express-jwt/controllers/logoutController.js])
    res.cookie("jwt", refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "None", secure: true});

    // 11.2.7 Yet, we still need to send both the refresh token and the access token to the user. And the easy part of this is to just remove what we were sending in our "json" method and instead send the access token as JSON. And as the frontend developer or as a full-stack developer you really want to store this access token in memory. It's not secure in local storage nor in any cookie that you can access with a JavaScript. So anything that could be accessed by JavaScript where we would store it — is not really secure. So if we store the access token in memory which has a very short life span (we only gave 30 sec here, but like I said normally you give it up to 15 mins). By keeping it in memory we're not storing it anywhere vulnerable.
    // res.json({"success": `User ${user} has been logged in`}); ↑
    res.json({accessToken});
  } else {
    res.status(401).json({"message": "Provided password does not match to login"});
  }
};

module.exports = {handleLogin};