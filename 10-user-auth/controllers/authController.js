// 10.6.0 Okay, since we've created and successfully tested the registration functionality it's time to work on authorization here. We'll create another controller for that and import DB, as we did at "registerController.js" already. And we also import "bcrypt" library here again, as we'll need it here too.
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

// 10.6.1 Then we'll create an async-function which code body starts the same, as the "handleNewUser" function did with getting username & password.
const handleLogin = async (req, res) => {
  const {user, pwd} = req.body;

  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required"});

  // 10.6.2 What we need to do next is try to find the user that's sent in before we even concern ourselves with the password let's see if username exists. So, we'll use "find" method and try to find the username that user typed in to authorize him on our server. If "find" method finds that user, it will be assigned to "foundUser" variable as value and if not then it will be false.
  const foundUser = await usersDB.users.find(person => person.username === user);

  // 10.6.3 So, if the username wasn't found in DB we'll send status 401 ("Unauthorized") and a message with a notice.
  if (!foundUser) return res.status(401).json({"message": "This username has not been registered yet"});

  // 10.6.4 But if the user has been found we'll want to go ahead and evaluate his password with "bcrypt" library here. We'll use the "compare" method from that library to compare the password that user typed in to login (first argument) and the password for the user that we founded in our DB (second argument).
  const match = await bcrypt.compare(pwd, foundUser.password);

  // 10.6.5 So, if "compare" method above returned true (meaning passwords are matched) we'll send as response message, that the user has been logged in. Else we'll send status 401 and a message with a notice.
  // (Go to [10-user-auth/routes/auth.js])
  if (match) {
    res.json({"success": `User ${user} has been logged in`});
  } else {
    res.status(401).json({"message": "Provided password does not match to login"});
  }
};

module.exports = {handleLogin};