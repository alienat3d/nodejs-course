// 8.3.1 In this API-router we'll also import Express.js and run it with the "Router" method as we did before to the other routes, but then we'll also create an empty object here and import the content of the JSON-file to that object's property "employees". This will connect API to the test database in JSON file so that our API can work with it. Of course, in the future we'll work on connecting to MongoDB (or you could connect to any other preferable database technology).
const express = require("express");
const router = express.Router();
const path = require("path");
const data = {};

data.employees = require("../../data/employees");

// 8.3.2 Now instead of using "router.get", "router.post", "router.put" etc. what we can do is using "router.route" method and pass in "/" as for root route. Then, we can chain different HTTP-methods that we want to provide for the same route.
router.route("/")
  // 8.3.3 So, for the "GET"-request we'll be returning JSON-data from the "data" object, and it's property "employees".
  .get((req, res) => {
    res.json(data.employees);
  })
  // 8.3.4 For the "POST"-request we can handle this completely differently for HTTP-method "POST" than we do for "GET". With the "post" we get parameters coming in to the request, and we can refer to those parameters with "req.body.nameOfParameter". And this "POST"-request would be posting a new employee. And we won't put the full code that we would have in an API at this moment because it's not really about coding an API now, as we're handling routes. So we just want to see how each one of these would work. We won't be writing out all the code for an API at this point and just showing how we can get the parameters from a "POST"-request, and we are just sending these parameters back. But this is how we could handle each route in an API.
  .post((req, res) => {
    res.json({
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
    });
  })
  // 8.3.5 Now, let's do the same thing with a "PUT"-request. As you probably remember, this HTTP method is used when we want to update an employee's data, for example. And, of course, code would be different if you were writing an actual API because you would be updating at that point, and we'll do that in the near future.
  .put((req, res) => {
    res.json({
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
    });
  })
  // 8.3.6 Let's also write the "delete" and it's will be different, as we wouldn't be getting the first name and the last name, but we would be getting an ID and we'll be sending ID back in this case.
  .delete((req, res) => {
    res.json({
      "id": req.body.id,
    });
  });

// 8.3.7 We'll add another route and this will be the dynamically changing parameter in URL "id". Although you could use any other HTTP-methods here, we'll need a "GET"-request here. And it will look almost the same, as the previous "GET"-request we've just written above, except we're referring to "params" and not to "body" here.
router.route("/:id")
  .get((req, res) => {
    res.json({"id": req.params.id});
  });

// ? 8.3.8 It's time to test the API we just created. For that, we could use the "Thunder Client" plugin for VS Code or create a special "requests.http" file in the root folder to test HTTP requests to our API.

module.exports = router;