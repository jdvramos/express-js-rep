const User = require('../model/User');

const handleLogout = async (req, res) => {
	// NOTE: When you code the client-side, you need to delete the accessToken, we can't do that in the server

	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(204); // No content
	const refreshToken = cookies.jwt

	// check first if refreshToken we get from the cookie does exist in the db
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}
	
	// Delete the refreshToken in of the user in db
	foundUser.refreshToken = '';
	const result = await foundUser.save();

	console.log(result);

	// secure: true - only serves on https
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) 

	res.sendStatus(204);
}

module.exports = { handleLogout };