// 11.9 Here we'll create a new route called "refresh", where we import the "refreshTokenController" and set it to "get" method for the root path.
// (Go to [11-express-jwt/server.js])
const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;