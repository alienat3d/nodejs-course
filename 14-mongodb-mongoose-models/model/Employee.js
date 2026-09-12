// 1.1.1 First, we need to import the "Mongoose" library here.
const mongoose = require("mongoose");

// 1.1.2 Second, we'll need to assign "mongoose.Schema" to a variable "Schema" then.
const Schema = mongoose.Schema;

// 1.1.3 Third, as we have that, we can define a Mongoose schema, and we'll call this "employeeSchema". Now we can map out our data. Now let's declare the employee data, as you remember it has the firstname, the lastname, both strings, and they should have the required flag. And, as said before, we don't need to create an id, as the ObjectId will be automatically created for us.
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

// 1.1.4 In the ond of file we'll export "mongoose.model" as we're creating a data model right here. And as the first argument for "model" method here we'll use "Employee" (same as the schema's filename), note it's not plural. And next argument will be "employeeSchema" that we've just created. Now, by default, when it creates that model, it will set this to lowercase and plural, so it will look for "employees" collection in MongoDB. We also can see that, if we go to the Mongoose docs (https://mongoosejs.com/docs/models.html) it said "Mongoose automatically looks for the plural, lowercased version of your model name." in there.
// (Go to [14-mongodb-mongoose-models/model/User.js])
module.exports = mongoose.model("Employee", employeeSchema);