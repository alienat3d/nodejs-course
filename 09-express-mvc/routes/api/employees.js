const express = require('express');
const router = express.Router();
// 9.2.0 Now, let's import the controllers file here.
const employeesController = require('../../controllers/employeesController');

// 9.1.0 Now, if we look at this file, we'll see that our logic essentially consists of route handlers. For example, inside the "get" method, there is a route handler that returns all the employees. We want to remove that logic and paste it into the "employeesController.js" file for each method.
// (Go to [09-express-mvc/controllers/employeesController.js])
// 9.2.1 And then, we'll pass all the route handlers from the "employeesController.js", where does it fit.
// (Go to [09-express-mvc/server.js])
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;