const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	}
});

// NOTE: By default, when Mongoose creates a model based on 'Employee' it will set it lowercase and plural so it will look for 'employees' collection in MongoDB.
module.exports = mongoose.model('Employee', employeeSchema);

