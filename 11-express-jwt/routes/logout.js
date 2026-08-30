// 11.13.0 Of course, as with the other controllers, we'll need to add a route for that and import it here.
// (Go to [11-express-jwt/server.js])
const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logoutController");

router.get("/", logoutController.handleLogout);

module.exports = router;