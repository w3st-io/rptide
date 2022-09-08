// [REQUIRE] //
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


// [REQUIRE] Personal //
const api_stripe = require('../../s-api/stripe');
const PasswordRecoveryCollection = require('../../s-collections/PasswordRecoveryCollection');
const UserCollection = require('../../s-collections/UserCollection');
const VerificationCodeCollection = require('../../s-collections/VerificationCodeCollection');
const ApiSubscriptionCollection = require('../../s-collections/ApiSubscriptionCollection');
const config = require('../../s-config');
const mailerUtil = require('../../s-utils/mailerUtil');
const WebAppModel = require('../../s-models/WebAppModel');


// [INIT] //
const location = '/user/index'


module.exports = {
	index: async ({ req }) => {
		// [INIT]
		let returnObj = {
			node_env: config.nodeENV
		};

		// [USER-LOGGED]
		if (req.user_decoded) {
			// [MONGODB]
			const uObj = await UserCollection.c_read(req.user_decoded._id);
			const webApps = await WebAppModel.find({ user: req.user_decoded._id });
			
			// [APPEND]
			returnObj = {
				...returnObj,
				user: uObj.user,
				webApps: webApps,
			};
		}

		// [SEND] 200
		return {
			status: true,
			executed: true,
			...returnObj
		};
	},

	/**
	 * @notice Login
	 * @param {string} req.body.email Email tied to account
	 * @param {string} req.body.password Password for account
	 * @returns {string} Object containing token (JWT token)
	*/
	login: async ({ req }) => {
		try {
			// [VALIDATE] email //
			if (
				!validator.isEmail(req.body.email) ||
				!validator.isAscii(req.body.email)
			) {
				return {
					executed: true,
					status: false,
					location: `${location}/login:`,
					message: `Invalid email`,
				};
			}
				
			// [VALIDATE] password //
			if (
				!validator.isAscii(req.body.password) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					executed: true,
					status: false,
					location: `${location}/login:`,
					message: `Invalid password`,
				};
			}

			// [READ][User] Get user by email //
			const userObj = await UserCollection.c_read_byEmail(req.body.email);

			if (!userObj.user) {
				return {
					executed: true,
					status: true,
					location: `${location}/login:`,
					message: `Invalid email or password`,
					validation: false
				};
			}

			// [VALIDATE-PASSWORD] //
			if (!bcrypt.compareSync(req.body.password, userObj.user.password)) {
				return {
					executed: true,
					status: true,
					location: `${location}/login:`,
					message: `Invalid email or password`,
					validation: false,
				};
			}

			// [SUCCESS] Authentication
			const token = jwt.sign(
				{
					_id: userObj.user._id,
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
			);

			const uObj = await UserCollection.c_read(req.user_decoded._id);

			const webApps = await WebAppModel.find({ user: uObj.user._id });
	
			return {
				executed: true,
				status: true,
				message: 'success',
				validation: true,
				token: token,
				user: uObj.user,
				webApps: webApps,
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/login:`,
				message: `${location}/login: Error --> ${err}`,
			};
		}
	},


	register: async ({ req }) => {
		try {
			if (config.app.acceptingUserRegistration == 'false') {
				return {
					executed: true,
					status: false,
					location: `${location}/register`,
					message: `We are currently not accepting new registrations`,
				}
			}

			// [VALIDATE] //
			if (
				!validator.isAscii(req.body.email) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					executed: true,
					status: false,
					location: `${location}/register`,
					message: `Invalid Params`,
				}
			}

			// [CREATE][User] //
			const userObj = await UserCollection.c_register({
				email: req.body.email,
				password: req.body.password,
			})

			if (!userObj.status || !userObj.created) { return userObj }

			// [CREATE][VerificationCode] //
			const vCodeObj = await VerificationCodeCollection.c_create({
				user_id: userObj.user._id
			})

			// [CREATE][ApiSubscription] //
			const subscriptionObj = await ApiSubscriptionCollection.c_create({
				user_id: userObj.user._id
			})
			
			// [MAIL] Verification Email //
			await mailerUtil.sendVerificationMail(
				userObj.user.email,
				userObj.user._id,
				vCodeObj.verificationCode.verificationCode
			)

			return {
				executed: true,
				status: true,
				created: true,
				location: `${location}/register`,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/register`,
				message: `Error --> ${err}`,
			}
		}
	},


	completeRegistration: async ({ req }) => {
		// [INIT] //
		const subLocation = '/complete-registration'

		try {
			// [VALIDATE] user_id //
			if (!validator.isAscii(req.body.user_id)) {
				return {
					executed: true,
					status: false,
					location: `${location}${subLocation}`,
					message: 'Invalid user_id',
				}
			}

			// [VALIDATE] verificationCode //
			if (!validator.isAscii(req.body.verificationCode)) {
				return {
					executed: true,
					status: false,
					location: `${location}${subLocation}`,
					message: 'Invalid verfication code',
				}
			}

			// [EXISTANCE][VerificationCode] //
			const vCObj = await VerificationCodeCollection.c__read__query({
				query: {
					user_id: req.body.user_id,
					verificationCode: req.body.verificationCode
				}
			})
			
			// [VALIDATE-STATUS] vCObj //
			if (!vCObj.status) { return vCObj }

			// [READ][User] //
			const userObj = await UserCollection.c_read(req.body.user_id)

			// [VALIDATE-STATUS] userObj //
			if (!userObj.status) { return userObj }

			// [UPDATE][ApiSubscription] //
			const apiSubObj_findOne = await ApiSubscriptionCollection.c_read_byUser({
				user_id: userObj.user._id
			})

			// [VALIDATE-STATUS] retrievedApiSubscriptionObj //
			if (!apiSubObj_findOne.status) { return apiSubObj_findOne }

			// if no cusId 
			if (!apiSubObj_findOne.apiSubscription.stripe.cusId) {
				const stripeObj = await api_stripe.aa_createCustomer(
					{
						user_id: userObj.user._id,
						email: userObj.user.email,
						username: userObj.user.username,
					}
				)
	
				// [VALIDATE-STATUS] stripeObj //
				if (!stripeObj.status) { return stripeObj }
	
				// [UPDATE][ApiSubscription] //
				const apiSubObj_updated = await ApiSubscriptionCollection.c_update__cusId__user_id(
					{
						user_id: userObj.user._id,
						cusId: stripeObj.createdStripeCustomer.id,
					}
				)
	
				// [VALIDATE] updatedApiSubscriptionObj //
				if (!apiSubObj_updated.status) { return apiSubObj_updated }
			}


			// [UPDATE][User] Verify //
			await UserCollection.c_verify(req.body.user_id)

			// [SUCCESS] //
			return {
				executed: true,	
				status: true,
				location: `${location}${subLocation}`,
				existance: vCObj.existance,
			}		
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}${subLocation}`,
				message: `Error --> ${err}`,
			}
		}
	},


	resendVerificationEmail: async ({ req }) => {
		const subLocation = '/resend-verification-email'

		try {
			// [VALIDATE] //
			if (!validator.isAscii(req.body.email)) {
				return {
					executed: true,
					status: false,
					location: `${location}${subLocation}`,
					message: `Invalid params`,
				}
			}

			// [READ][User] Get User by Email //
			const user = await UserCollection.c_read_byEmail(req.body.email)

			// [READ][VerificationCode] by user_id //
			const vCode = await VerificationCodeCollection.c_read_byUser_id({
				user_id: user.user._id
			})
			
			// [SEND-MAIL] //
			mailerUtil.sendVerificationMail(
				req.body.email,
				user.user._id,
				vCode.verificationCode.verificationCode
			)

			return {
				executed: true,
				status: true,
				location: `${location}${subLocation}`,
				message: `Verification email sent`,
			}
			
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}${subLocation}`,
				message: `Error --> ${err}`,
			}
		}
	},


	requestResetPassword: async ({ req }) => {
		try {
			// [VALIDATE] //
			if (!validator.isAscii(req.body.email)) {
				return {
					executed: true,
					status: false,
					location: `${location}/request-reset-password:`,
					message: `${location}/request-reset-password: Invalid params`,
				}
			}

			const user = await UserCollection.c_read_byEmail(req.body.email)
			
			if (!user.status) { return user }

			// [CREATE][PasswordRecovery] //
			const passwordRecovery = await PasswordRecoveryCollection.c_create(
				user.user._id
			)
			
			if (!passwordRecovery.status || passwordRecovery.existance) {
				return passwordRecovery
			}

			// [SEND-MAIL] //
			return await mailerUtil.sendPasswordResetEmail(
				req.body.email,
				user.user._id,
				passwordRecovery.passwordRecovery.verificationCode
			)
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/request-reset-password:`,
				message: `${location}/request-reset-password: Error --> ${err}`,
			}
		}
	},


	resetPassword: async ({ req }) => {
		try {
			if (
				!validator.isAscii(req.body.user_id) ||
				!validator.isAscii(req.body.verificationCode) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					executed: true,
					status: false,
					location: `${location}/reset-password`,
					message: 'Invalid params',
				}
			}

			// [EXISTANCE][PasswordRecovery] //
			const existance = await PasswordRecoveryCollection.c_existance(
				req.body.user_id
			)

			if (!existance.existance) {
				return {
					executed: true,
					status: false,
					location: `${location}/reset-password`,
					message: 'You have not made a request to reset your password',
				}
			}

			// [VALIDATE][PasswordRecovery] //
			const pwdRecovery = await PasswordRecoveryCollection.c_validateToken(
				req.body.user_id,
				req.body.verificationCode
			)

			if (!pwdRecovery.status || !pwdRecovery.valid) { return pwdRecovery }

			// [UPDATE][User] Password //
			const updatedPwd = await UserCollection.c_update_password(
				req.body.user_id,
				req.body.password
			)

			if (!updatedPwd.status) { return updatedPwd }

			// [DELETE][PasswordRecovery] //
			const deletedPR = await PasswordRecoveryCollection.c_delete_byUser(
				req.body.user_id
			)

			if (!deletedPR.status) { return deletedPR }

			return {
				executed: true,
				status: true,
				location: `${location}/reset-password`,
				message: `Password reset`,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/reset-password`,
				message: `Error --> ${err}`,
			}
		}
	},
}