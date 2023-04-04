const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	
	if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

	// check first if username provided does exist in the db
	const foundUser = await User.findOne({ username: user }).exec();
	if (!foundUser) return res.sendStatus(401); // Unauthorized

	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		// We attached the .filter(Boolean) to remove null values
		const roles = Object.values(foundUser.roles).filter(Boolean);

		// create JWTs
		const accessToken = jwt.sign(
			{ 
				"UserInfo": {
					"username": foundUser.username,
					"roles": roles
				} 
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);

		const refreshToken = jwt.sign(
			{ "username": foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		// Saving refreshToken with current user
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();

		console.log(result);

		// Cookie is sent for every request, however httpOnly is secured because JS can't access it
		// Remove property 'secure: true' when testing with Thunder Client to make /refresh route work, but put it back because it's required with Chrome when app is deployed
		res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});

		res.json({ roles, accessToken });
	} else {
		res.sendStatus(401);
	}
}

module.exports = { handleLogin };