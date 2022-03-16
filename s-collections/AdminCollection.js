// [REQUIRE] //
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const AdminModel = require('../s-models/AdminModel')


module.exports = {
	/******************* [CRUD] *******************/
	c_read_byEmail: async (email) => {
		try {
			// [VALIDATE] user_id //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: 'AdminCollection: Invalid email'
				}
			}
		
			const user = await AdminModel.findOne({ email })
	
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `AdminCollection: Error --> ${err}`
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [REGISTER] //
	c_register: async (username, email, password) => {
		try {
			// [VALIDATE] username //
			if (!validator.isAscii(username)) {
				return {
					executed: true,
					status: false,
					message: 'AdminCollection: Invalid username (must be ASCII)'
				}
			}
	
			// [VALIDATE] email //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: 'AdminCollection: Invalid email'
				}
			}
	
			// [VALIDATE] password //
			if (!validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					message: 'AdminCollection: Invalid password (must be ASCII)'
				}
			}
	
			// Username Check //
			if (await AdminModel.findOne({ username })) {
				return {
					executed: true,
					status: false,
					message: 'This username is taken',
					created: false,
				}
			}
		
			// Email Check //
			if (await AdminModel.findOne({ email })) {
				return {
					executed: true,
					status: false,
					message: 'This email is already registered',
					created: false,
				}
			}
		
			// Password Length //
			if (password.length < 8 || password.length > 50) {
				return {
					executed: true,
					status: false,
					message: 'Password invalid (8 < password < 50)',
					created: false,
				}
			}
	
			// Hash Password //
			const hashedPassword = await bcrypt.hash(password, 10)
	
			// [SAVE] //
			const user = await new AdminModel({
				_id: mongoose.Types.ObjectId(),
				role: 'not-admin',
				username: username,
				email: email,
				password: hashedPassword,
			}).save()
			
			return {
				executed: true,
				status: true,
				message: 'Successfully created account',
				created: true,
				user: user,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `AdminCollection: Error --> ${err}`,
				created: false,
			}
		}
	},
}