// 1.5.1 Let's start here with the importing "Employee" model.
const Employee = require("../model/Employee");

// 1.5.2 To get the list of all employees, we'll use the "find" method. If nothing is found, we'll send a status of 204 ("no content") along with a message about it. If the list of employees is found, we'll send it in the response with the "json" method.
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) return res.status(204).json({"message": "No employees found."});
  res.json(employees);
};

// 1.5.3 In the "createNewEmployee" function, we're going to change quite a few things compared to when we were working with the JSON database. First, we'll modify the if-statement to check if the request exists and, if so, if the "firstname" or "lastname" fields are included in the body object. If these conditions aren't met, we'll send status code 400 ("bad request") along with a message about it.
const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(400).json({"message": "First and last names are required"});
  }

  // 1.5.4 In a "try...catch" block, we will create a document for MongoDB with the "create" method. We will pass an object in which the values for the "firstname" and "lastname" fields will be the fields with the same names from the request body object. Then, we will send it with "json" along with the status code 201.
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({"message": "ID parameter is required."});
  }

  // 1.5.5 Once again, some parts of the "updateEmployee" function will be different from when we worked with the JSON database. We'll replace the way we find an employee by its ID and use the "findOne" method for that, passing "id" from the request body into it. Note that we'll use "_id" for MongoDB because it automatically generates IDs with that name in the database. And as we're using the "await" here we shouldn't forget about "exec" method at the end to call that function in the action.
  const employee = await Employee.findOne({_id: req.body.id}).exec();

  // 1.5.6 If the employee isn't found using the ID we passed in, we'll send status code 204 and a message.
  if (!employee) {
    return res.status(204).json({"message": `No employee matches ID ${req.body.id}.`});
  }

  // 1.5.7 Then, we will check if the "firstname" and "lastname" fields exist in the request body object. We will then assign values from these fields to update the MongoDB database document. We must also use the "save" method afterward to apply the changes to the database.
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
};

// 1.5.8 The "deleteEmployee" function looks similar to the previous one, except that it uses the "deleteOne" method to delete the document from the database. And for that method we don't need to put the "exec" method at the end. (If you forget, you can read in the Docs at https://mongoosejs.com/ which methods require the "exec" method and which do not.)
const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({"message": "Employee ID required."});

  const employee = await Employee.findOne({_id: req.body.id}).exec();
  if (!employee) {
    return res.status(204).json({"message": `No employee matches ID ${req.body.id}.`});
  }
  const result = await employee.deleteOne(); //{ _id: req.body.id }
  res.json(result);
};

const getEmployee = async (req, res) => {
  // 1.5.9 For the "getEmployee" function, we first need to check the employee route. If it's not there, we need to send back status code 400 and the message that an employee ID is required.
  if (!req?.params?.id) return res.status(400).json({"message": "Employee ID required."});

  // 1.5.10 Similar to previous method we'll be using "findOne" method to find the employee by its id, but from request's "params", not from "body" object, as we're getting that id from URL here. ↓
  const employee = await Employee.findOne({_id: req.params.id}).exec();
  if (!employee) {
    return res.status(204).json({"message": `No employee matches ID ${req.params.id}.`});
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};

// ? 1.6 That's it for the CRUD operations here. It's time to test if everything is written correctly and functioning properly. For testing, we'll head to the [15-mongo-async-crud/http/auth.http] file to simulate the authorization and then try to create a new employee with the request inside the [15-mongo-async-crud/http/requests.http] file. Good, all the tests passed and everything is working as it should.

// ? 1.7 In the end of this course let's have a look at one of the easiest ways to deploy Node.js project and we're going to deploy this project to the glitch.com