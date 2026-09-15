// 1.3.0 The next controller to update is the one for authentication. We will do the same as we did with the others: import the 'User' model and delete the unnecessary stuff we needed to handle the JSON database.
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  // 1.3.1 We'll keep those lines where we get a username and password from the request body, as well as a status code with a message if any of those are missing.
  const {user, pwd} = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});

  // 1.3.2 Next, we'll need to find the user in the database using the familiar pattern, as we did in previous controllers. We're using the "findOne" method for that, followed by "exec." If nothing is found, we'll send back status code 401.
  const foundUser = await User.findOne({username: user}).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // 1.3.3 Nothing really to change here until we come down to where we're interacting with the file.
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "10s"},
    );
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: "1d"},
    );

    // 1.3.4 We'll assign the "refreshToken" created above to the "refreshToken" field of the "foundUser" object. Then, we'll save it to the MongoDB database using the "save" method.
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    console.log(roles);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000});

    // Send authorization roles and access token to user
    res.json({roles, accessToken});

  } else {
    res.sendStatus(401);
  }
};

module.exports = {handleLogin};

// ? 1.4.0 After all the changes we've made, it's time to run some tests. We'll start the server with the command `npm run dev` and use the http-files for the test [15-mongo-async-crud/http/register.http] (or the Thunder Client in VS Code). Let's take a look at the "register.http" file. It contains the user that is already in the database. If we run that file, we'll receive a status code of 409, "Conflict," which is the correct response. Now, let's try registering another user in the MongoDB database for testing purposes.
// ? 1.4.1 Good, we can see the message that a new user created and also see it in the MongoDB database. Next, let's test the authorization with [15-mongo-async-crud/http/auth.http] file. As well as refreshing token with [15-mongo-async-crud/http/refresh.http] and logging out with [15-mongo-async-crud/http/logout.http] files.

// 1.5.0 Okay, now that we've passed all the tests and confirmed that our changes are working, let's make some changes to the controllers that work with the "employees" collection.
// (Go to [15-mongo-async-crud/controllers/employeesController.js])