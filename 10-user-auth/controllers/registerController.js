// 10.1.0 Lets starting out here by pulling in users from user's DB that we're simulating with that JSON-file. We'll create an object and set this up much like you've probably seen it with "useState" hook in ReactJS. We'll import the users into the "users" prop and add a function that will write data into "users" prop.
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

// 10.1.1 But we also need some other things, as we're going to work with that JSON-file. "fs" as we're working with the file system and "path" for the paths.
const fsPromises = require("fs").promises;
const path = require("path");

// 10.1.2 Also we would need to install and import "bcrypt" package that helps to "hash & salt" the passwords that we become, so we can securely and safely store in our DB.
const bcrypt = require("bcrypt");

// 10.2.0 Next, we'll define handler for the new user information that we'll receive at this register route. This will be an async-function, as we want to use "await" with "bcrypt" and maybe we'll need that somewhere else too.
const handleNewUser = async (req, res) => {
  // 10.2.1 When we first pull this information in the request is going to have a username & a password. So, lets destructure that from the request body.
  const {user, pwd} = req.body;

  // 10.2.2 Next we need to check if username, password or both were not provided we'll send the status 400 and a message with a note about what's went wrong.
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required"});

  // 10.2.3 If username and password are provided we'll need to check for duplicate usernames in the DB. So we'll use method "find" on the "users" array and try to find if just submitted by user "username" is already exist in there.
  const duplicate = usersDB.users.find(person => person.username === user);

  // 10.2.4 So, if we have found a username duplicate, then we'll return status 409 which means "conflict" as HTTP-status stands for and a message with notice.
  if (duplicate) return res.status(409).json({"message": `User already exists`});

  // 10.2.5 If there are no duplicate found, we'll go further with the "try...catch" construction. So if its catches an error we'll send a 500 status and also an error message we've received. And inside the "try"-block we're going to create a new user using "bcrypt" package to hash the password. And that's how we do it: we'll use method "hash" that will receive the password typed by the user and as the second argument there will be number which is the "salt" rounds. So this package is not only hashes the password, but it adds a salt to it that really helps protect the password if the DB is somehow compromised because at that point if a hacker were able to figure out the hash they could crack all the passwords in the DB.
  try {
    const hashedPwd = await bcrypt.hash(pwd, 12);
    const newUser = {"username": user, "password": hashedPwd};
    // 10.2.6 Then, after we hashed and salted password, we're going to store the new user and that will be an object with "username" and "password" props we'll add to the DB with the function "setUsers" we've created inside "usersDB" object at the very beginning of this file. And we're working with immutable data instead of adding to the existing array we're going to create a brand-new array and then set all of that in the DB. Very similar to how it's realized at ReactJS.
    usersDB.setUsers([...usersDB.users, newUser]);
    // 10.2.7 Then, let's write it to the JSON-file which is our DB in this simulation, and we'll use "fsPromises" and it's method "writeFile" for that. The first argument will be the path and the second is what we're going to replace with — the updated array with a new user inside.
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users));
    console.log(usersDB.users);
    // 10.2.8 Finally we'll need to send the status 201 and a message that new user was created.
    // (Go to [10-user-auth/routes/register.js])
    res.status(201).json({"success": `A new user ${user} has been created successfully.`});
  } catch (err) {
    res.status(500).json({"message": err.message});
  }
};

module.exports = {handleNewUser};