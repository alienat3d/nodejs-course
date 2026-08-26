// 9.1.2 We also need the data here. The data that we were pulling into the employees.js route will need to be inside the controller at this point. Let's also refactor how we import the data from "employees.json" into the "data" object. The employees data set will pull it in and set it directly to the employees property of the data object. We've also got a "setEmployees" function that we'll use in the other functions below. ↓
const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

// 9.1.1 Let's create a variable, name it "getAllEmployees" and assign the logic of the according route handler to it, that returns all the employees listed in the DB. ↑
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

// 9.1.3 Let's do the same with the "POST"-request — cut & paste the route handler here. And so we do with the rest HTTP-requests of our API.
// (Go to [09-express-mvc/routes/api/employees.js])
// 9.5.0 Now, we'll add some JavaScript code to our route handlers here to emulate the working API before we've connected it to a real database. When we create a new employee we want to create the new id instead of importing a package like "uuid" or similar, we'll just grab the last employee's id, and we'll add 1 to that number whatever it is. And if it doesn't exist yet, then it will be set to 1. Other than that, all the props that describing an employee are assigned to the parameters we're getting from "req.body.nameOfProp".
const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    position: req.body.position,
    salary: req.body.salary,
  };

  // 9.5.1 After that we're checking if each of the prop are sent and if not, we'll send a status 400 and return message with a notice.
  if (
    !newEmployee.firstname ||
    !newEmployee.lastname ||
    !newEmployee.age ||
    !newEmployee.gender ||
    !newEmployee.position ||
    !newEmployee.salary
  ) {
    return res.status(400).json({"message": "All of the fields are required."});
  }

  // 9.5.2 Next, we'll use "setEmployees" function to set the new employee into the list of employees in the array.
  data.setEmployees([...data.employees, newEmployee]);
  // 9.5.3 Right after that we have to send status 201 (which means it created a new record).
  res.status(201).json(data.employees);
};

// 9.6.0 Here we grab an employee by its ID, and if an employee with such ID doesn't exist we'll be returning status 400 (meaning we didn't get good data) with a notice.
const updateEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  // 9.6.1 And right after that, we'll be checking each of the props of employee object and set a new parameter value to update the info about an employee.
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  if (req.body.age) employee.age = req.body.age;
  if (req.body.gender) employee.gender = req.body.gender;
  if (req.body.position) employee.position = req.body.position;
  if (req.body.salary) employee.salary = req.body.salary;
  // 9.6.2 Then, we filter the array and remove the existing employee record from it. So, then we have an array without that existing employee, which we found in the beginning, and then add that employee updated back to the array. We'll name that new array "unsortedArray" because we need to remember it's unsorted yet, as we need this array in chronological order by ID.
  const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, employee];
  // 9.6.3 When we call the "setEmployees" function from the "data" object, we sort the array by the "id" property. We'll use a chained ternary statement for the sorting.
  data.setEmployees(unsortedArray.sort((a, b) => {
    return a.id > b.id ?
      1 :
      a.id < b.id ?
        -1 :
        0;
  }));
  // 9.6.4 Then, we'll send employees after the "setEmployees" function updates the array.
  res.json(data.employees);
};

// 9.7.0 The "deleteEmployee" code will look similar. We'll find the employee in the list by its ID. If the ID isn't there, we'll return a status of 400 with a notice message.
const deleteEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if (!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
  }
  // 9.7.1 So, once the check has passed, we'll filter the array to exclude the employee we found by ID. Then, we'll return the rest of the array because we want to delete that employee.
  const filteredArray = data.employees.filter(employee => employee.id !== parseInt(req.body.id));
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

// 9.8 Finally, it's "getEmployee" that is handling a request for the data of just one employee. So, once again we're finding out who that employee is by its ID. And again if that ID doesn't exist we'll do the same as we did above. But if it exists all we need to do is return data for that specific employee.
const getEmployee = (req, res) => {
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) {
    return res.status(400).json({"message": `Employee ID ${req.params.id} not found`});
  }
  res.json(employee);
};

// ? 9.9 After writing all the functions, it's time to test them via the [09-express-mvc/requests.http] file, which we use to test requests to the API with the WebStorm IDE. As we can see, our API is working properly.

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};