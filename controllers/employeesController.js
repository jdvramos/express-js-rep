const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
};

const createNewEmployee = async (req, res) => {
    // if we don't have the firstname and lastname we return a 400 status
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' })
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
};

const updateEmployee = async (req, res) => {
    // Return a status 400 if id is not defined
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    // Finds the data of an employee that matches the id in the req.body
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    // Immediately return a 204 if id in the req.body is not found in the employees collection
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }

    // Sets the updated firstname and lastname property in the employee object
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    // Save the employee
    const result = await employee.save();

    // We send the result as the response
    res.json(result);
};

const deleteEmployee = async (req, res) => {
    // Return a status 400 if id is not defined
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' })

    // Find the employee by its id and store it to employee variable
    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    // Immediately return a 204 if id in the req.body is not found in the employees collection
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }

    // Delete the employee
    const result = await employee.deleteOne({ _id: req.body.id });

    // We send the result as the response
    res.json(result);
};

const getEmployee = async (req, res) => {
    // Return a status 400 if id is not defined as params 
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' })

    // Find the employee by its id and store it to employee variable
    const employee = await Employee.findOne({ _id: req.params.id }).exec();

    // Immediately return a 204 if id in the req.body is not found in the employees collection
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
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
