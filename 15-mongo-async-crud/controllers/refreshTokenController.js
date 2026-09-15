// 1.1.1 We'll import the "User" model here, and then we'll update the "handleRefreshToken" function.
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // 1.1.2 We'll start the same with defining the cookie and of course get JWT from the cookie if it exists.
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // 1.1.3 But then, as far as checking to find a user we have to do that differently compared to as we did that while working just with JSON database, but pretty much similar to that what we were doing in the previous tutorial (see [14-mongodb-mongoose-models/controllers/registerController.js (1.2.3)]). Well, this time we won't have the username, but besides that it will be very similar, and we'll use "refreshToken" here, as we get the refresh token from the cookies and JWT to "refreshToken" variable above. And we still need to use the "exec" method here, as we're using asynchronous function here and "await" word.
  const foundUser = await User.findOne({refreshToken}).exec();

  // 1.1.4 And, of course, if we have not found the refresh token we'll send status code of 403, which is "Forbidden".
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // 1.1.5 Then we'll use the same definitions as before and it's nothing else to change in the refresh token route.
  // (Go to [14-mongodb-mongoose-models/controllers/logoutController.js])
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
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
        {expiresIn: "10s"},
      );
      res.json({roles, accessToken});
    },
  );
};

module.exports = {handleRefreshToken};