// [IMPORT]
import mongoose from "mongoose";

// [IMPORT] Personal
import PasswordRecoveryModel from "../s-models/PasswordRecovery.model";


/******************* [EXISTANCE] *******************/
const c_existance = async (user_id) => {
	try {
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: "Invalid user_id",
			}
		}

		if (!await PasswordRecoveryModel.findOne({ user: user_id })) {
			return {
				executed: true,
				status: true,
				message: "Password recovery does NOT exists",
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: "Password recovery exists",
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
				message: "Invalid user_id",
			}
		}

		// [VALIDATE] user_id
		if (!verificationCode) {
			return {
				executed: true,
				status: false,
				message: "No verificationCode passed",
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
				message: "Password Recovery verificationCode invalid",
				valid: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: "Password Recovery verificationCode valid",
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


export default {
	c_existance,
	c_validateToken,
}