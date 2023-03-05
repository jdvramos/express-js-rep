const data = {
    employees: require("../model/employees.json"),
    setEmployees: function (data) {
        this.employees = data;
    },
};
const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ message: "First and last names are required." });
    }

    data.setEmployees([...data.employees, newEmployee]);

    // status 201 means 'created'
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    // Finds the data of an employee that matches the id in the req.body
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    // Immediately returns when id in the req.body is not found in the data.employees
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }

    // Sets the updated first name and last name property in the employee object
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    // This gets all the employee data in the data.employees but leaves out the id that is being updated.
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));

    // Combines the new employee object and the filteredArray
    const unsortedArray = [...filteredArray, employee];

    // Sets the new employees. Since id are unsorted we will use a sorting logic.
    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

    // We send all employees as response
    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    // Find the employee by its id and store it to employee variable
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    // If employee is undefined or falsy (means we did not find the specified id provided by the user) we will return with a status code of 400.
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }

    // We filter once again, this is the logic for "deleting" an employee
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));

    // We set the filteredArray as new employees obj;
    data.setEmployees([...filteredArray]);

    // We send the new employees obj as response
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));

    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
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
