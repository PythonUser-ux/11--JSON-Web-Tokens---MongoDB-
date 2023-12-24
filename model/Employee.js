// naming this file with the capital initial is a convention
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({            // in schemas we don't need an ID field since this is automatically provided
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Employee', employeeSchema);

// by default mongoose when creating this model will set this to lowercase and plural (the collection will be "employees")