// 1.1.5 We'll create a "User" schema as well, and it has a little more to it. So, we start here about the same as with the "Employee" schema, but when it comes to "roles" it a little bit different. So we have "User" which was a possible role, and then we specify some details about that role here inside an object. Here we'll add a type, which is a number, and then we can put a default value. So if not specified any user that's created will be automatically be assigned the value of 2001. That's the basic user value that we'd previously applied. Then, the next role was "Editor" which is a number and another role was "Admin" which is a number too. Notice that we're not providing default values for last two roles, and we're not even saying they're required, as not everybody will have "Editor" or "Admin" roles, right. And in the end of this schema we also store a refresh token, so that when user's created they don't have a refresh token, but after they're authenticated they get one, so this is a string, but it hasn't a default value and isn't required, because it's not always there.
// (Go to [14-mongodb-mongoose-models/controllers/registerController.js])
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);