// 12.5.0 Now is the time to create a new middleware (this one) that is going to accept a lot of parameters if we wanted to, depending on how many roles we want to pass in. The way to do that is with rest-operator.
// 12.5.1 Next, we'll create a middleware function that as usual takes a "request", "response" and "next" parameters.
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 12.5.2 And inside of that function we'll have an if-statement, where we say, if we don't have a request, which we should because our JWT will come before this, then we'll say even if we have request it needs to have roles otherwise it's not valid and return 401 status code that means "unauthorized".
    if (!req?.roles) return res.sendStatus(401); // unauthorized

    // 12.5.3 Then, let's define the roles array, and it should consist of all the roles, that will come to "allowedRoles" parameter in this middleware, and we'll spread those parameters in this array here.
    const rolesArray = [...allowedRoles];

    console.log(rolesArray);
    console.log(req.roles);

    // 12.5.4 Next, we'll compare arrays. First, we'll compare the user roles that come from JWT ("req.roles") with the user roles passed in as parameters to this middleware ("allowedRoles"). We'll use the "map" method to create a new array. For this, we'll compare each role from "req.roles" to the roles in the "rolesArray" array. We'll see if the rolesArray includes each role that we're passing in from JWT array and if it does it will return true (that's what method "includes" does), so it's boolean result. So, we'll create a new array with true or false for the every role that we were passing in (so if we had three different roles, then we'll have possibly "true false true" or "true true true", who knows for sure). So, we also need to filter this array with "find" method, as we only need one true to know that the role can access the route we're. Inside the "find" method we say that for each "value" (true or false) in the new array that was mapped we'll check if it's equal to true and if it is, then it will be returned to "result" variable and if it is not — it won't be returned. So, we say here "hey, find the first role that has value true in that mapped array" and if there is any with true it will be good.
    const result = req.roles.map(role => rolesArray.includes(role))
      .find(value => value === true);

    // 12.5.5 Then, we'll check if there are no any roles, those did return true, so the "result" array is empty, then we'll send status code 401 "unauthorized".
    if (!result) return res.sendStatus(401); // unauthorized

    // 12.5.6 Otherwise we'll call "next" because everything is good, and we're ready to move on and we're going to let the route be accessed.
    // (Go to [12-express-user-roles/routes/api/employees.js])
    next();
  };
};

module.exports = verifyRoles;