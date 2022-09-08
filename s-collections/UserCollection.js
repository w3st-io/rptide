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