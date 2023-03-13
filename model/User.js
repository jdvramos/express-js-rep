const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	roles: {
		User: {
			type: Number,
			default: 2001
		},
		Editor: Number,
		Admin: Number
	},
	password: {
		type: String,
		required: true
	},
	refreshToken: String
});

// NOTE: By default, when Mongoose creates a model based on 'User' it will set it lowercase and plural so it will look for 'users' collection in MongoDB.
module.exports = mongoose.model('User', userSchema);

