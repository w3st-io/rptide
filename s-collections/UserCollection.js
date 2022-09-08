// [REQUIRE] //
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const UserModel = require('../s-models/UserModel')


// [INIT] //
const location = 'UserCollection'


module.exports = {
	/******************* [OTHER-CRUD] *******************/
	// [CREATE] User (with password) //
	c_register: async ({ email, password }) => {
		try {

			// [VALIDATE] email //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid email`
				}
			}
	
			// [VALIDATE] password //
			if (!validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid password`
				}
			}
	
			// Email Check //
			if (await UserModel.findOne({ email })) {
				return {
					executed: true,
					status: true,
					message: 'That email is already registered',
					created: false,
				}
			}
	
			// Password Length //
			if (password.length < 8 || password.length > 50) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid password`,
					created: false,
				}
			}
	
			// [ENCRYPT] Hash Password //
			const hashedPassword = await bcrypt.hash(password, 10)
	
			// [SAVE] //
			const user = await new UserModel({
				_id: mongoose.Types.ObjectId(),
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
				message: `${location}: Error --> ${err}`,
				created: false,
			}
		}
	},


	c_read_byApiPrivateKey: async ({ privateKey }) => {
		try {
			// [READ] //
			const uo = await UserModel.findOne({
				"api.privateKey": privateKey
			})

			console.log(privateKey);
			
			if (uo) {
				return {
					executed: true,
					status: true,
					location: location,
					user: uo
				}
			}

			return {
				executed: true,
				status: false,
				location: location,
				message: `No User Found`
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_verifiedStatus: async (user_id) => {
		try {
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}
	
			const user = await UserModel.findOne({
				_id: user_id,
				verified: true,
			})
	
			if (user) {
				return {
					executed: true,
					status: true,
					message: 'User verified',
					user: user,
				}
			}
			else {
				return {
					executed: true,
					status: false,
					message: 'User NOT verified',
					user: user,
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
			}
		}
	},
}