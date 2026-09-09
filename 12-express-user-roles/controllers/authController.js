const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const {user, pwd} = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});
  const foundUser = usersDB.users.find(person => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // 12.2.2 Here, when we authorize and create the access token we'll want to send this information in the access token, so we're going to change our payload for the JWTs. First, when we know we have match, and we have verified the user we're going to grab the roles that we put in our users JSON file.
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);

    // 12.2.3 So let's also change the access toke payload a little bit, since we're not just sending the username here, let's create a new namespace and call it "UserInfo" that will be an object. Inside of that object we'll have the username and all the roles for that user values.
    // ? 12.2.4 What is good about using that different namespace "UserInfo" here is that it's considered to be a private JWT claim, because there are some reserved abbreviations and words for public JWT claims (you can find out more about that JWT claims at [JSON Web Token (JWT) Debugger](https://www.jwt.io/)). And now there is no reason to send the roles in the refresh token and ideally the access token will only be stored in memory on the frontend. But we don't have control over that, so when we do send the roles we're just sending the code and not actually the word "admin", "editor" or any other role's name. We're kind of hiding what each one is by using codes. But in the same time ideally that access token would only be stored in memory anyway. But there is no need whatsoever to send the roles in the refresh token, as the refresh token is only there to verify that you can get a new access token.
    // (Go to [12-express-user-roles/controllers/refreshTokenController.js])
    // create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "30s"},
    );
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: "1d"},
    );
    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
    const currentUser = {...foundUser, refreshToken};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users),
    );
    // ? 12.8 One more important note before we end this tutorial: when we're testing API with "Thunder Client" plugin in VS Code, for example, it honors the cookie setting for secure, if it's true or not. So, if we were to set a cookie and then use the refresh token here, we'd need to remove "secure: true" option or the cookie wouldn't work with "Thunder Client" plugin. However, this option is required as we noted in the previous tutorial when working in Chrome. So, just a note — if we're testing the refresh endpoint with a refresh cookie we'll have to comment this part out or at least take it out for testing purposes with "Thunder Client" plugin. But then for tests in Chrome and in production, we'll need to bring back that option in when we're creating that refresh token that is saved in a cookie. We didn't use that in this tutorial, as the refresh token doesn't store any information about the user roles and it shouldn't.
    res.cookie("jwt", refreshToken, {httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000});
    res.json({accessToken});
  } else {
    res.sendStatus(401);
  }
};

module.exports = {handleLogin};