// 1.2.0 Alright, now when we created two basic schemas for our data "User" & "Employee" and also created models to be associated with those, let's go ahead and implement the user schema and model. We'll attach that to one of controllers. Let's do it with the register controller first. That makes sense where we'd create a new user. And now you'll see how much easier Mongoose makes interacting with the MongoDB collection than it is to write all of this stuff that we've been doing with the file system module and interacting with JSON files, so let's simplify this file and just switch it over to using MongoDB.
// 1.2.1 So, instead of "UserDB", that we had up here we'll just bring in the "User" model. We won't need "fsPromises" nor "path" here anymore.
const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  // 1.2.2 The body of that async function start out the same — we need the user and password to come in from the request and if we don't have those, we'll send the same information back. That's a bad request.
  const {user, pwd} = req.body;
  if (!user || !pwd) return res.status(400).json({"message": "Username and password are required."});

  // 1.2.3 But now, when we check for duplicates we're interacting with a different database, so now this will change just a little, and we still define duplicate but how we get the duplicate is completely different. We'll call the "findOne" method on "User" model and then pass in some info here: we're looking for a username that matches the "user" that we defined from request above. After that we need to call "exec" method at the end. Not every Mongoose method needs that on the data model but this one in particular does and that's because we could pass in a callback function afterward (like an error result, for example), but if you don't do that and using "async...await" pattern here, then you need to put "exec" at the end of "findOne" method (as it also said in documentation under "findOne"). This is going to return any user that matches the user that was passed in and of course we don't want a duplicate, so this is the same. If there is a duplicate we need to send this 409 code "conflict".
  // check for duplicate usernames in the db
  const duplicate = await User.findOne({username: user}).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    // 1.2.4 After that we need to handle the password in the same way.
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // 1.2.6 With Mongoose we can create and store all at once. And we'll be using method "create" here for that. What we also can exclude from here now is the "roles" field, as we have the default data in our schema already, and it will be added automatically.
    //create and store the new user
    const result = await User.create({
      "username": user,
      "password": hashedPwd,
    });

    console.log(result);

    // ? 1.3 Let's discuss a couple of other ways a record could be created that you might see somewhere, although I prefer to do that the way it was done above, because it happens all at once with "create" method, and we get the result back stored into "result" variable. But there are some different variants can be, like:
    // const newUser = new User();
    // newUser.username = user;
    // newUser.password = hashedPwd;
    // ? 1.3.1 In the end of all that you want to save, so you'd need to write:
    // const result = await newUser.save();

    // ? 1.3.2 Or you might also see something like the new user being created and then passing that data in like we did inside of user create, so instead of using "dot-notation" you might see something like:
    /* const newUser = new User({
      "username": user,
      "password": hashedPwd,
    });

    await newUser.save(); */

    // ? 1.4.0 Okay, it's time to test out the changes to the register controller. We'll try creating a new database user with the [14-mongodb-mongoose-models/http/register.http] file that we have for API tests. Everything is working fine. We see the info that the user has been created in the console: there is a username, the roles that are assigned to that user, encrypted password and a new ObjectId. Notice that other field "__v" with a value 0 here that's always added ("__v" stands for the version key, and it keeps track of this and can be incremented manually if we want to). We also can see the new user added inside our cluster on mongodb.com, so we're good!

    // ? 1.4.1 Alright, but if we look closer to the users documents those have been created we can see that they all have roles "User" and we would like to change that for some of them. So let's add to "walt2" user also "Editor" & "Admin" roles. To do that we'll click at the "✏️" pencil-button and then add to the "roles" (click at the "+" button) object those two more fields with the roles we want him to have. So it will be "Editor" field with the value 1984 and "Admin" field with value 5150. We also need to change the default "String" type to "Int32" for both. Then we have to click on "Update" button to save changes.

    // 1.2.5 But after the password is created our code is going to get much simpler, and we'll get rid of many excessive code we've had before, but keep the status 201 though because is what we want to send when we create the new user. ↑
    res.status(201).json({"success": `New user ${user} created!`});
  } catch (err) {
    res.status(500).json({"message": err.message});
  }
};

module.exports = {handleNewUser};