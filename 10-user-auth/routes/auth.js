// 10.7 We'll add also an extra route here for the authorization.
// (Go to [10-user-auth/server.js])
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/", authController.handleLogin);

module.exports = router;