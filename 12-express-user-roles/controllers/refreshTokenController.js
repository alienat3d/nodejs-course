const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      // 12.3 Now, at this refresh token controller we have to add about the same code, because that refresh token does issue a new access token. So, right underneath where we were decoding the refresh token and if we have no error and everything is good. Right before we create the token let's once again define roles. And the same goes about the payload object, where we'll create a new namespace "UserInfo" and add "roles" field to its object, as we've just done before.
      // ? 12.4.0 After we've updated our tokens to include the roles our access tokens specifically, we're going to middleware, because we have to create a new middleware to verify those roles. But first let's head to the "verifyJWT" middleware we already have.
      // (Go to [12-express-user-roles/middleware/verifyJWT.js])
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
            "roles": roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "30s"},
      );
      res.json({accessToken});
    },
  );
};

module.exports = {handleRefreshToken};