// 11.15.0 And then we created this new middleware, that imports "allowedOrigins" and is what really doing here is to check if the origin that is sending the request is in our allowedOrigins list, then it sets the header "Access-Control-Allow-Credentials" on the response. And otherwise we'll be likely getting an error in the browser on a frontend.
// (Go to [11-express-jwt/server.js])
const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;