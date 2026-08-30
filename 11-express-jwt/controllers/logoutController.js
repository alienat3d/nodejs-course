// 11.12.1 We could actually copy the "refreshTokenController" and modify it to save time, as they're pretty similar to each other. However, we'll use different libraries here, and it's "fs" and "path". We'll need they to access the current JSON-file we're using for user's database.
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // ? 11.12.2 Let's leave a note for the frontend here (for the times you'll be working with UI) that we also should delete it on frontend as we can't do that from backend here. So, we need to do that in the memory of the client application and set it to blank when the "Logout" button is clicked.
  // todo: "On client, also delete the accessToken"

  // 11.12.3 But what we'll do is take care of the refresh token. And the same, as in "refreshTokenController.js" we'll get the cookies from the request object and check first if the cookies exists and if yes, then if it has "jwt" property. If check passed we'll return status 204 ("Successful request. No content to send back.")
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  // 11.12.4 And if check didn't pass we'll grab the refresh token from "jwt" property and this search for the same refresh token in the database that matches.
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

  // 11.12.5 What we'll do at this point is in case we haven't found a refresh token in the database that matches we can go ahead and clear the cookie with "clearCookie" method that accepts as the first argument the name, where that cookie stored and as the second we must pass the same options that it was set with.
  // 11.12.6 And then we'll return a 204 status ("Successful. No content.").
  // 11.16.1 We should add the same options, "sameSite" and "secure," here where we are clearing the cookie. When we delete a cookie, we have to set the same options except for the "maxAge" option (same thing about "expiration" option, BTW), which isn't necessary when deleting a cookie.
  if (!foundUser) {
    res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true});
    return res.sendStatus(204);
  }

  // 11.12.7 At this point, we have found the same refresh token in the database and can delete it. We'll use the "fs" library to access the file system and the "users.json" file (our simulation of the DB until we transition to MongoDB). Then, using the "filter" method, we'll filter out all users except for the user found above by his "refreshToken".
  // 11.12.8 Then, we'll create a new object, "currentUser," and copy the "foundUser" object using the "spread" operator. Then, we'll set the "refreshToken" property of "currentUser" to an empty string. Next, we can set the "currentUser" and "otherUsers" objects as the value of "usersDB" using its "setUsers" method.
  // Delete refreshToken in db
  const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
  const currentUser = {...foundUser, refreshToken: ""};
  usersDB.setUsers([...otherUsers, currentUser]);

  // 11.12.9 We'll use the "writeFile" function from the "fs" library to access "users.json" and overwrite its contents with the contents of "users.DB.users".
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users),
  );

  // 11.12.10 Then, we'll have to delete the cookie, same as we did above (see line 27). And we have to send 204 status again ("Successful. No content."), as we're not sending anything here.
  // (Go to [11-express-jwt/routes/logout.js])
  res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true});
  res.sendStatus(204);
};

module.exports = {handleLogout};