const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
// 11.4.0 Then, we'll need to add that middleware here.
// const verifyJWT = require("../../middleware/verifyJWT");

// 11.4.1 And then, if we wanted it only in a "get" route we can add it to it before we call the controller. So, it goes through the "verifyJWT" middleware first and then goes to the controller here.
// 11.6.0 We were applying this "verifyJWT" middleware to get route right now and this is a good way to do this if you have select routes that you want to protect or verify but not all of them. However, if you know you want to protect all the routes in your API — there is an easier way to do this. So, let's go ahead and comment this middleware we add here and go to our main "server.js" file.
// (Go to [11-express-jwt/server.js])
router.route("/")
  // .get(verifyJWT, employeesController.getAllEmployees)
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

// ? 11.5 So, time for tests, let's log in via [11-express-jwt/http/auth.http] file first. We'll use it to authorize our user and get status 200 with an access token, which is only good for a short time, so we can quickly go to [10-user-auth/requests.http] and try to send "get all employees" request" until the token is expired. And it works as it should. ↑

router.route("/:id")
  .get(employeesController.getEmployee);

module.exports = router;