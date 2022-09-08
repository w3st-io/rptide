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
const UserModel = require('../../s-models/UserModel');


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
			// [MONGODB][User]
			const user = await UserModel.findOne({
				_id: req.user_decoded._id
			}).select('-password -api.publicKey').exec();

			// [MONGODB][WebApp]
			const webApps = await WebAppModel.find({ user: req.user_decoded._id });
			
			// [APPEND]
			returnObj = {
				...returnObj,
				user: user,
				webApps: webApps
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
			const user = await UserModel.findOne({ email: req.body.email });

			if (!user) {
				return {
					executed: true,
					status: false,
					location: `${location}/login:`,
					message: `Invalid email or password`,
					validation: false
				};
			}

			// [VALIDATE-PASSWORD] //
			if (!bcrypt.compareSync(req.body.password, user.password)) {
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
					_id: user._id,
					email: user.email,
					username: user.username,
					first_name: user.first_name,
					last_name: user.last_name,
					verified: user.verified
				},
				config.app.secretKey,
				{
					expiresIn: config.app.nodeENV == 'production' ? 7200 : 10000000
				}
			);

			const webApps = await WebAppModel.find({ user: user._id });
	
			// [MONGODB][QUERY]
			const returnableUser = await UserModel.findOne({
				_id: user._id
			}).select('-password -api.publicKey').exec();

			return {
				executed: true,
				status: true,
				message: 'success',
				validation: true,
				token: token,
				user: returnableUser,
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

			// [MONGODB][READ] User //
			const user = await UserModel.findOne({ _id: req.user_decoded._id })
				.select('-password -api.publicKey')
				.exec();

			// [UPDATE][ApiSubscription] //
			const apiSubObj_findOne = await ApiSubscriptionCollection.c_read_byUser({
				user_id: user._id
			})

			// [VALIDATE-STATUS] retrievedApiSubscriptionObj //
			if (!apiSubObj_findOne.status) { return apiSubObj_findOne }

			// if no cusId 
			if (!apiSubObj_findOne.apiSubscription.stripe.cusId) {
				const stripeObj = await api_stripe.aa_createCustomer(
					{
						user_id: user._id,
						email: user.email,
						username: user.username,
					}
				)
	
				// [VALIDATE-STATUS] stripeObj //
				if (!stripeObj.status) { return stripeObj }
	
				// [UPDATE][ApiSubscription] //
				const apiSubObj_updated = await ApiSubscriptionCollection.c_update__cusId__user_id(
					{
						user_id: user._id,
						cusId: stripeObj.createdStripeCustomer.id,
					}
				)
	
				// [VALIDATE] updatedApiSubscriptionObj //
				if (!apiSubObj_updated.status) { return apiSubObj_updated }
			}


			// [UPDATE][User] Verify //
			await UserModel.findOneAndUpdate(
				{ _id: req.body.user_id },
				{ $set: { verified: true } }
			);

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


	/**
	 * @notice Resend verification email
	 * @param req.body.email Email to recover password for
	*/
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
			const user = await UserModel.findOne({ email: req.body.email })

			// [READ][VerificationCode] by user_id //
			const vCode = await VerificationCodeCollection.c_read_byUser_id({
				user_id: user._id
			})
			
			// [SEND-MAIL] //
			mailerUtil.sendVerificationMail(
				req.body.email,
				user._id,
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

	/**
	 * @notice Send the email for the password reset
	 * @param req.body.email Email to recover password for
	*/
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

			const user = await UserModel.findOne({ email: req.body.email });
			
			if (!user.status) {
				return {
					executed: true,
					status: false,
					message: "No user found"
				}
			}

			// [CREATE][PasswordRecovery] //
			const passwordRecovery = await PasswordRecoveryCollection.c_create(
				user._id
			)
			
			if (!passwordRecovery.status || passwordRecovery.existance) {
				return passwordRecovery
			}

			// [SEND-MAIL] //
			return await mailerUtil.sendPasswordResetEmail(
				req.body.email,
				user._id,
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

			// [MONGODB][UPDATE] user.password //
			await UserModel.findOneAndUpdate(
				{ _id: req.body.user_id },
				{
					$set: {
						password: await bcrypt.hash(req.body.password, 10)
					}
				}
			)

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