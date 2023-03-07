const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) {
		this.users = data;
	}
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
	// NOTE: On client, also delete the accessToken

	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(204); // No content
	const refreshToken = cookies.jwt

	// check first if refreshToken we get from the cookie does exist in the db
	const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}
	
	// Delete the refreshToken in db
	const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
	const currentUser = {...foundUser, refreshToken: ''};
	usersDB.setUsers([...otherUsers, currentUser]);

	// Update the models/users.json
	await fsPromises.writeFile(
		path.join(__dirname, '..', 'model', 'users.json'),
		JSON.stringify(usersDB.users)
	)
	
	// secure: true - only serves on https
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) 

	res.sendStatus(204);
}

module.exports = { handleLogout };