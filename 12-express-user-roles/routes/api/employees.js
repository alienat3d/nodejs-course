const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
// 12.6.0 In our API-route we have some imports to add here. We'll need the "ROLES_LIST" and also our new "verifyRoles" middleware.
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// 12.6.1 And we also need to add those to the different routes. So the "get"-route stay open and anyone could access that. Or if we wanted to put verifyRoles to at least verify their user — they already have to have the JWT because we required that ahead of time to access the "get"-route, so kind of the user is the default.
// 12.6.2 But after that let's put in the "verifyRoles" middleware for the "post"-route and the others, where we pass in the different roles list values, that we want to let access this route. So, obviously our "Admin" roles will have access to any route, but "Editor" role will have access only to "post" & "put" routes.
router.route("/")
  .get(employeesController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id")
  .get(employeesController.getEmployee);

module.exports = router;

// ? 12.7 Okay, time to test our modifications and start the server with "npm run dev". Then, we'll use our ".http" files to run tests. So let's go to the [12-express-user-roles/http/auth.http] file and change the request content a little bit, so that we're requesting to authorize as "dave1" user, as that's the user that only has the "User" role/permission and has not "Editor" or "Admin" permissions. Then we can also check what requests we're really allowed to accomplish also with the "Editor" and the "Admin" roles.
// (Go to [12-express-user-roles/controllers/authController.js])