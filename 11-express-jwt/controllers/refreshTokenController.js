// 11.8.1 We'll need this controller because we're also going to have a refresh token route. And we could actually copy the code from [11-express-jwt/controllers/authController.js] but, of course, we'll need to do some modifications and have to delete some excessive parts from it (we won't need "bcrypt" or "fs" libraries here).
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 11.8.2 This function doesn't need to be async, so we'll just have the request and response here. After that we won't be looking for a password, but we're looking for a cookies. And we'll have a similar to "authController" if-statement here at the beginning, but we'll be checking for a couple of things: 1) we actually have cookies; 2) if we have "jwt" property at cookies. And if one of those not existing we'll send status 401 ("Unauthorized"), and we don't really need the JSON-message after that. And after that we'll can assign the token to "refreshToken".
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // 11.8.3 And here we do want to find a user, as now we're receiving a refresh token and not a username or password for this, so we'll say "person.refreshToken" shall be strict equal to what is inside "refreshToken" we've received from cookies. And if we didn't find a user we'll be sending status 403 ("Forbidden").
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // 11.8.4 Here we'll be evaluating JWT with a special method from "jsonwebtoken" library "verify". It accepts refresh token as the first argument, then as the second it will be secret refresh token from ".env" and then as the third it will be an anonymous function that will accept an "err" and "decoded" parameters. So, if we don't have the valid token (i.e. we have an error or the value of the "username" property doesn't really fit to the "username" value decoded from the token), then we'll send status 403 ("Forbidden").
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

      // 11.8.5 And if all is fine, we're ready to create a new access token to send because the refresh token has varified. We'll assign method "sign" to this "accessToken", which accepts the payload object with the username from the decoded from refreshToken username's value, then an access secret token from ".env" and an options object, where we set it to be expired after 30 seconds.
      const accessToken = jwt.sign(
        {"username": decoded.username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30s"},
      );

      // 11.8.6 After an access token is created we'll send this token with a "json" method.
      // (Go to [11-express-jwt/routes/refresh.js])
      res.json({accessToken});
    },
  );
};

module.exports = {handleRefreshToken};