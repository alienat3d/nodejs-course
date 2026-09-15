// 1.2.0 So, we'll start the same in the logout controller with importing the "User" model here and the getting the cookies from request inside the "handleLogout" function.
const User = require("../model/User");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // 1.2.1 Here we'll use "findOne" method, just like we did already at refresh token controller and don't forget the "exec" method at the end of it, as its asynchronous operation here.
  // Is refreshToken in db?
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true});
    return res.sendStatus(204);
  }

  // 1.2.2 Next part is getting much simpler, as where we delete the refresh token we're no longer interacting with JSON here. So we'll erase the refresh token simply by assigning an empty string to it. And then we'll use the "save" method to "foundUser" then to save changes at the MongoDB document that is stored to the user collection. That "foundUser" is a document now that we've found above.
  // (Go to [15-mongo-async-crud/controllers/authController.js])
  // Delete refreshToken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true});
  res.sendStatus(204);
};

module.exports = {handleLogout};