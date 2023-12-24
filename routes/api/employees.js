const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');

router.route('/')   // this is an alternative to using router.get, router.post etc...
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')       // note we are using a parameter inside the request
    .get(employeesController.getEmployee);

// the Thunder Client extension is used to test our routes

module.exports = router;