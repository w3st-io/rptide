// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../../s-config')
const UserCollection = require('../../s-collections/UserCollection')


// [INIT] //
const location = '/s-hander/user'


module.exports = {
	login: async ({ email, password }) => {
		try {
			// [VALIDATE] email //
			if (!validator.isEmail(email) || !validator.isAscii(email)) {
				return {
					executed: true,
					status: false,
					location: `${location}/login:`,
					message: `${location}/login: Invalid email`,
				}
			}
				
			// [VALIDATE] password //
			if (!validator.isAscii(password) || !validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					location: `${location}/login:`,
					message: `${location}/login: Invalid password`,
				}
			}

			// [READ][User] Get user by email //
			const userObj = await UserCollection.c_read_byEmail(email)

			if (!userObj.user) {
				return {
					executed: true,
					status: true,
					location: `${location}/login:`,
					message: `${location}/login: Invalid email or password`,
					validation: false
				}
			}

			// [VALIDATE-PASSWORD] //
			if (!bcrypt.compareSync(password, userObj.user.password)) {
				return {
					executed: true,
					status: true,
					location: `${location}/login:`,
					message: `${location}/login: Invalid email or password`,
					validation: false,
				}
			}

			const token = jwt.sign(
				{
					user_id: userObj.user._id,
					email: userObj.user.email,
					username: userObj.user.username,
					first_name: userObj.user.first_name,
					last_name: userObj.user.last_name,
					verified: userObj.user.verified
				},
				config.app.secretKey,
				{
					expiresIn: config.app.nodeENV == 'production' ? 7200 : 10000000
				}
			)
	
			return {
				executed: true,
				status: true,
				message: 'success',
				validation: true,
				token: token,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/login:`,
				message: `${location}/login: Error --> ${err}`,
			}
		}
	},
}