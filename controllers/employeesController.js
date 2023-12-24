// const data = {
//     employees: require('../model/employees.json'),
//     setEmployees: function (data) {this.employees = data}
// };

const Employee = require('../model/Employee');

const getAllEmployees = async (req,res)=>{
    // res.json(data.employees);
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({'message': 'No employees found'});
    res.json(employees);
}

const createNewEmployee = async (req,res)=>{
    // const newEmployee = {
    //     id: data.employees[data.employees.length - 1].id + 1 || 1,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname}

    // if (!newEmployee.firstname || !newEmployee.lastname){
    //     return res.status(400).json({'message':'First and last names are required.'});
    // }

    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({'message':'First and last names are required.'});
    }

    firstname = req.body.firstname;
    lastname  = req.body.lastname;

    const duplicate = await Employee.findOne({firstname, lastname}).exec(); // not every mongoose method needs exec();
    if (duplicate) return res.sendStatus(409); // Conflict

    // data.setEmployees([...data.employees, newEmployee]);
    // res.status(201).json(data.employees)
    try{
        const updatedEmployeeList = await Employee.create({firstname, lastname});
        res.status(201).json(updatedEmployeeList) // 201 -> "Created"
    } catch (err){
        console.error(err);
    }
}

const updateEmployee = async (req,res)=>{
    // const newEmployee = {
    //     id: req.body.id,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname}

    // if (!newEmployee.id){
    //     return res.status(400).json({'message':'id is required.'});
    // }

    // if(!(newEmployee.id < data.employees.length+1)){
    //     return res.status(400).json({'message':'To-be-replaced employee not found.'});
    // }

    // data.setEmployees([...data.employees.slice(0, newEmployee.id-1), newEmployee, ...data.employees.slice(newEmployee.id, data.employees.length)]);
    // res.status(201).json(data.employees)

    if (!req?.body?.id){
        return res.status(400).json({'message':'id is required.'});
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();

    if (!employee){
        return res.status(204).json({"message": `No Employee matches ID ${req.body.id}`});
    }

    if(!req.body?.firstname) employee.firstname = req.body.firstname;
    if(!req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    res.json(result);

}

const deleteEmployee = async (req,res)=>{
    if (!req?.body?.id){
        return res.status(400).json({'message':'id is required.'});
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();

    if (!employee){
        return res.status(204).json({"message": `No Employee matches ID ${req.body.id}`});
    }

    const result = await Employee.deleteOne({_id: req.body.id});
    res.json(result);

}

const getEmployee = async (req,res)=>{
    if (!req?.params?.id){
        return res.status(400).json({'message':'id is required.'});
    }
    const employee = await Employee.findOne({_id: req.params.id}).exec();

    if (!employee){
        return res.status(204).json({"message": `No Employee matches ID ${req.body.id}`});
    }

    res.json(employee);

}

module.exports = {getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee}