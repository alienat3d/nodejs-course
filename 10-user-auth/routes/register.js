// ? 10.3 Now, we also need a new route for registering new user as well, so we'll create it quickly.
// (Go to [10-user-auth/server.js])
const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

router.post("/", registerController.handleNewUser);

module.exports = router;