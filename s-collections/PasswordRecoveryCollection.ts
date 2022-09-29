// [IMPORT]
import mongoose from "mongoose"

// [IMPORT] Personal
import PasswordRecoveryModel from "../s-models/PasswordRecoveryModel";


// [REQUIRE]
const uuid = require('uuid')


/******************* [CRUD] *******************/
// [CREATE]
const c_create = async (user_id) => {
	try {
		// [VALIDATE] user_id
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		// [SAVE]
		const passwordRecovery = await new PasswordRecoveryModel({
			_id: new mongoose.Types.ObjectId(),
			user: user_id,
			verificationCode: uuid.v4()
		}).save()

		return {
			executed: true,
			status: true,
			message: 'Created passwordRecovery',
			passwordRecovery: passwordRecovery
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PasswordRecoveryCollection: Error --> ${err}`,
		}
	}
}


/******************* [OTHER-CRUD] *******************/
// [DELETE] User
const c_delete_byUser = async (user_id) => {
	try {
		// [VALIDATE] user_id
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		await PasswordRecoveryModel.deleteMany({ user: user_id })

		return {
			executed: true,
			status: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PasswordRecoveryCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] Custom //
const c_delete_custom = async (filter) => {
	try {
		// [VALIDATE] filter
		if (!filter) {
			return {
				executed: true,
				status: false,
				message: 'CommentLikeCollection: No filter passed',
				updated: false,
			}
		}

		await PasswordRecoveryModel.deleteMany(filter)

		return {
			executed: true,
			status: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PasswordRecoveryCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (user_id) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		if (!await PasswordRecoveryModel.findOne({ user: user_id })) {
			return {
				executed: true,
				status: true,
				message: 'Password recovery does NOT exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Password recovery exists',
			existance: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PasswordRecoveryCollection: Error --> ${err}`,
		}
	}
}


/******************* [VALIDATION] *******************/
const c_validateToken = async (user_id, verificationCode) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'Invalid user_id',
			}
		}

		// [VALIDATE] user_id
		if (!verificationCode) {
			return {
				executed: true,
				status: false,
				message: 'No verificationCode passed',
			}
		}

		// [VALIDATE][EXISTANCE]
		const existance = await c_existance(user_id)

		if (!existance.status || !existance.existance) { return existance }

		// [VALIDATE]
		const passwordRecovery = await PasswordRecoveryModel.findOne({
			user: user_id,
			verificationCode: verificationCode
		})

		if (!passwordRecovery) {
			return {
				executed: true,
				status: true,
				message: 'Password Recovery verificationCode invalid',
				valid: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Password Recovery verificationCode valid',
			passwordRecovery: passwordRecovery,
			valid: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PasswordRecoveryCollection: Error --> ${err}`,
		}
	}
}


module.exports = {
	c_create,
	c_delete_byUser,
	c_delete_custom,
	c_existance,
	c_validateToken,
}