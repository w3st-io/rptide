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
					message: `${location}: Invalid user_id`,
				}
			}
		
			// [SAVE] //
			const verificationCode = await new VerificationCodeModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				verificationCode: uuid.v4(),
			}).save()
	
			return {
				executed: true,
				status: true,
				verificationCode: verificationCode,
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


	// [READ] //
	c_read: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`,
				}
			}
	
			const vCode = await VerificationCodeModel.findOne({ user: user_id })
	
			if (vCode) {
				return {
					executed: true,
					status: true,
					message: '',
					existance: true,
					verificationCode: vCode,
				}
			}
			
			return {
				executed: true,
				status: true,
				message: '',
				existance: false,
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


	/******************* [OTHER-CRUD] *******************/
	// [DELETE] user //
	c_delete_byUser: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`,
				}
			}
		
			const vCode = await VerificationCodeModel.deleteMany({ user: user_id })
	
			return {
				executed: true,
				status: true,
				verificationCode: vCode,
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


	/******************* [VALIDATE] *******************/
	c_validate: async ({ user_id, verificationCode }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`,
				}
			}
	
			// [VALIDATE] verificationCode //
			if (!validator.isAscii(verificationCode)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid verificationCode`,
				}
			}
	
			const vCode = await VerificationCodeModel.findOne({
				user: user_id,
				verificationCode: verificationCode,
			})
	
			if (vCode) {
				return {
					executed: true,
					status: true,
					message: 'Valid verification code',
					existance: true,
				}
			}
	
			return {
				executed: true,
				status: true,
				message: 'Invalid verification code',
				existance: false,
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


	/******************* [EXISTANCE] *******************/
	c_existance: async (user_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`,
				}
			}
	
			const vCode = await VerificationCodeModel.findOne({ user: user_id })
	
			if (vCode) {
				return {
					executed: true,
					status: true,
					message: 'Valid verification code',
					existance: true,
				}
			}
	
			return {
				executed: true,
				status: true,
				message: 'Invalid verification code',
				existance: false,
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
