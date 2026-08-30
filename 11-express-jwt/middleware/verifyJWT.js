// 11.3.0 Let's create a new middleware, and we'll also need those two libs, that we used already in "authController.js" for JWT and ".env" files.
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 11.3.1 Then, we'll create a middleware function "verifyJWT" with "req", "res" & "next" parameters, as middleware should have.
const verifyJWT = (req, res, next) => {
  // 11.3.2 Then, we'll create "authHeader" variable and assign the headers for authorization from request.
  const authHeader = req.headers["authorization"];

  // 11.3.3 We'll also check here if we can't get those headers we'll send back status 401 (which means "Unauthorized").
  if (!authHeader) return res.sendStatus(401);

  // 11.3.4 So, if authorization is succeeded we'll see the headers in the console, which give us "Bearer token" line.
  console.log(authHeader); // Bearer token

  // 11.3.5 Next, we'll define a token now. We'll take the "authHeader" and use "split" method on it. And we'll put the space in here on the split. And then we need a token. So, it wouldn't be in the zero position it's in the one position after that.
  const token = authHeader.split(" ")[1];

  // 11.3.6 So, after we've got the token we can verify it with the "verify" method. And here we need to pass in the token first, then we'll pull in the access token secret from ".env" (that's what we'll verify with this middleware). As the third argument there will be a callback function that gets an error, and then we'll call this "decoded" (because it's decoded data from the JWT) and say "if we have an error, then return status 403 (means "forbidden"). At this point we would know that we've received a token, but something about it wasn't right. In other words it may have been tampered with and so it means it's invalid token.
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token

      // 11.3.7 Then, we'll set the user equal to "username" at decoded data from JWT, as we sent it inside before.
      // (Go to [11-express-jwt/routes/api/employees.js])
      req.user = decoded.username;
      next();
    },
  );
};

module.exports = verifyJWT;