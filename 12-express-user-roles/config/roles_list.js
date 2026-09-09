// ? 12.0 In the roles list we're going to create the user roles. Now this could be in a data table in a DB, this is how we're going to do this. And you'll find the user permissions can be constructed in an assortment of ways, but today we're going to apply a fairly simple structure with just three different user roles. They keys are will be the names of roles and their values will be the codes that identifies the role.
// ? 12.1 Right after that we'll go to the "users" model [12-express-user-roles/model/users.json] and modify it adding "roles" field to each of the users with the "roles" or permissions they'll have at our API. Well, there could be an admin area for whatever service you were creating and that is where these additional roles can be created, but what we'll do is just ensure when everyone registers they're given the "User" role. And then later on you'd think an admin that was in charge could add the additional roles if those roles were to be granted to other users.
// 12.2.0 Alright, after modifying our users DB let's have a look at that register controller that we have.
// (Go to [12-express-user-roles/controllers/registerController.js])
const ROLES_LIST = {
  "Admin": 5150,
  "Editor": 1984,
  "User": 2001,
};

module.exports = ROLES_LIST;