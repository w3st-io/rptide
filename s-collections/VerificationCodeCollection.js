// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')
const uuid = require('uuid')


// [REQUIRE] Personal //
const VerificationCodeModel = require('../s-models/VerificationCodeModel')


// [INIT] //
const location = 'VerificationCodeCollection'


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id',
				}
			}
		
			// [SAVE] //
			const verificationCode = await new VerificationCodeModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				verificationCode: uuid.v4(),
			}).save()
	
			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				location: location,
				verificationCode: verificationCode,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`,
			}
		}
	},


	// [READ] //
	c_read_byUser_id: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id',
				}
			}
	
			// [QUERY] //
			const queryResult = await VerificationCodeModel.findOne({
				user: user_id
			})
	
			// [NOTHING-FOUND] //
			if (!queryResult) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'No VerificationCode object found',
				}
			}

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				message: '',
				location: location,
				existance: true,
				verificationCode: queryResult,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`,
			}
		}
	},


	// [READ] //
	c__read__query: async ({ query }) => {
		try {
			// [QUERY] //
			const queryResult = await VerificationCodeModel.findOne(query)
	
			// [NOTHING-FOUND] //
			if (!queryResult) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'No VerificationCode object found',
				}
			}

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				message: 'VerificationCode Object found',
				location: location,
				queryResult: queryResult,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [DELETE] user //
	c_delete_byUser: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid user_id`,
				}
			}
		
			// [DELETE] //
			const vCode = await VerificationCodeModel.deleteMany({ user: user_id })
	
			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				location: location,
				verificationCode: vCode,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`,
			}
		}
	},
}
