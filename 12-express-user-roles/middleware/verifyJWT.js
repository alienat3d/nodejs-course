const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  // 12.4.1 Let's make a couple of quick updates here. First, when we define the authorization header, it can be written as "authorization," where the "a" can be in lowercase or uppercase. It would be better to take that into account here.
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // 12.4.2 After that we'll modify our if-statement here. Let's say if we don't have the auth-header or if we don't have one that starts with "Bearer " string then status code 401 should be returned.
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token

      // 12.4.3 Then, after we decode this token when verifying JWT we'll also set the roles here together with the user on the request.
      // (Go to [12-express-user-roles/middleware/verifyRoles.js])
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    },
  );
};

module.exports = verifyJWT;