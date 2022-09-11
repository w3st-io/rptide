// [REQUIRE]
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


// [REQUIRE] Personal
const api_stripe = require('../../s-api/stripe');
const PasswordRecoveryCollection = require('../../s-collections/PasswordRecoveryCollection');
const VerificationCodeCollection = require('../../s-collections/VerificationCodeCollection');
const ApiSubscriptionCollection = require('../../s-collections/ApiSubscriptionCollection');
const config = require('../../s-config');
const WebAppModel = require('../../s-models/WebAppModel');
const UserModel = require('../../s-models/UserModel');
const mailerUtil = require('../../s-utils/mailerUtil');


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: '/api',
	message: ''
};


module.exports = {
	/**
	 * @notice Default route to initialize app
	 * @returns {Object}
	 */
	index: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			node_env: config.nodeENV,
			location: returnObj.location + ''
		};

		try {
			// [USER-LOGGED]
			if (req.user_decoded) {
				// [MONGODB][User]
				const user = await UserModel.findOne({
					_id: req.user_decoded._id
				}).select('-password -api.publicKey').exec();

				// [MONGODB][WebApp]
				const webApps = await WebAppModel.find({ user: req.user_decoded._id });
				
				// [APPEND]
				childReturnObj = {
					...childReturnObj,
					user: user,
					webApps: webApps
				};
			}

			console.log({
				...childReturnObj,
				status: true
			});
			
			return {
				...childReturnObj,
				status: true
			};
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			};
		}
	},

	/**
	 * @notice Login
	 * @param {string} req.body.email Email tied to account
	 * @param {string} req.body.password Password for account
	 * @returns {string} Object containing token (JWT token)
	*/
	login: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/login',
			message: 'Success',
			validation: false
		};

		try {
			// [VALIDATE] email
			if (
				!validator.isEmail(req.body.email) ||
				!validator.isAscii(req.body.email)
			) {
				return {
					...childReturnObj,
					message: `Invalid email`,
				};
			}
				
			// [VALIDATE] password
			if (
				!validator.isAscii(req.body.password) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					...childReturnObj,
					message: `Invalid password`,
				};
			}

			// [READ][User] Get user by email
			const user = await UserModel.findOne({ email: req.body.email });

			if (!user) {
				return {
					...childReturnObj,
					message: `Invalid email or password`
				};
			}

			// [VALIDATE-PASSWORD]
			if (!bcrypt.compareSync(req.body.password, user.password)) {
				return {
					...childReturnObj,
					message: `Invalid email or password`
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
				{ expiresIn: config.app.nodeENV == 'production' ? 7200 : 10000000 }
			);

			const webApps = await WebAppModel.find({ user: user._id });
	
			// [MONGODB][QUERY]
			const returnableUser = await UserModel.findOne({
				_id: user._id
			}).select('-password -api.publicKey').exec();

			return {
				...childReturnObj,
				status: true,
				validation: true,
				token: token,
				user: returnableUser,
				webApps: webApps
			};
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			};
		}
	},

	/**
	 * @notice Register
	 * @param {string} req.body.email
	 * @param {string} req.body.password Password for account
	*/
	register: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/register',
			message: 'Successfully created account',
			created: false
		};

		try {
			if (config.app.acceptingUserRegistration == 'false') {
				return {
					...childReturnObj,
					message: 'We are currently not accepting new registrations'
				};
			}

			// [VALIDATE] req.body.email
			if (!validator.isEmail(req.body.email)) {
				return {
					...childReturnObj,
					message: 'Invalid email'
				};
			}

			// Email Check
			if (await UserModel.findOne({ email: req.body.email })) {
				return {
					...childReturnObj,
					message: 'That email is already registered'
				};
			}
	
			// [VALIDATE] req.body.password
			if (!validator.isAscii(req.body.password)) {
				return {
					...childReturnObj,
					message: 'Invalid password'
				};
			}
	
			// [VALIDATE] req.body.password
			if (password.req.body.password < 8 || req.body.password.length > 100) {
				return {
					...childReturnObj,
					message: 'Invalid password'
				};
			}

			// [MONGODB][SAVE][User]
			const user = await new UserModel({
				_id: mongoose.Types.ObjectId(),
				email: email,
				password: await bcrypt.hash(password, 10)
			}).save();

			// [MONGODB][CREATE][VerificationCode]
			const vCodeObj = await VerificationCodeCollection.c_create({
				user_id: userObj.user._id
			});

			// [MONGODB][CREATE][ApiSubscription]
			await ApiSubscriptionCollection.c_create({ user_id: userObj.user._id });
			
			// [MAIL] Verification Email
			await mailerUtil.sendVerificationMail(
				userObj.user.email,
				userObj.user._id,
				vCodeObj.verificationCode.verificationCode
			);

			// [SUCCESS]
			return {
				...childReturnObj,
				status: true,
				created: true,
				user: user
			};
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			};
		}
	},


	/**
	 * @notice Complete Registration
	 * @param {string} req.body.user_id
	 * @param {string} req.body.req.body.verificationCode
	*/
	completeRegistration: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/complete-registration',
			message: 'Completed registration'
		};

		try {
			// [VALIDATE] user_id
			if (!validator.isAscii(req.body.user_id)) {
				return {
					...childReturnObj,
					message: 'Invalid user_id'
				};
			}

			// [VALIDATE] verificationCode
			if (!validator.isAscii(req.body.verificationCode)) {
				return {
					...childReturnObj,
					message: 'Invalid verfication code'
				};
			}

			// [EXISTANCE][VerificationCode]
			const vCObj = await VerificationCodeCollection.c__read__query({
				query: {
					user_id: req.body.user_id,
					verificationCode: req.body.verificationCode
				}
			});
			
			// [VALIDATE-STATUS] vCObj
			if (!vCObj.status) { return vCObj; }

			// [MONGODB][READ] User
			const user = await UserModel.findOne({ _id: req.user_decoded._id })
				.select('-password -api.publicKey')
				.exec();

			// [UPDATE][ApiSubscription]
			const apiSubObj_findOne = await ApiSubscriptionCollection.c_read_byUser({
				user_id: user._id
			});

			// [VALIDATE-STATUS] retrievedApiSubscriptionObj
			if (!apiSubObj_findOne.status) { return apiSubObj_findOne; }

			// if no cusId 
			if (!apiSubObj_findOne.apiSubscription.stripe.cusId) {
				const stripeObj = await api_stripe.aa_createCustomer(
					{
						user_id: user._id,
						email: user.email,
						username: user.username,
					}
				);
	
				// [VALIDATE-STATUS] stripeObj
				if (!stripeObj.status) { return stripeObj; }
	
				// [UPDATE][ApiSubscription]
				const apiSubObj_updated = await ApiSubscriptionCollection
					.c_update__cusId__user_id(
						{
							user_id: user._id,
							cusId: stripeObj.createdStripeCustomer.id,
						}
					);
	
				// [VALIDATE] updatedApiSubscriptionObj
				if (!apiSubObj_updated.status) { return apiSubObj_updated; }
			}

			// [UPDATE][User] Verify
			await UserModel.findOneAndUpdate(
				{ _id: req.body.user_id },
				{ $set: { verified: true } }
			);

			// [SUCCESS]
			return {
				...childReturnObj,
				status: true,
				existance: vCObj.existance
			};
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			};
		}
	},


	/**
	 * @notice Resend verification email
	 * @param req.body.email Email to recover password for
	*/
	resendVerificationEmail: async ({ req }) => {
		let childReturnObj = {
			executed: true,
			status: false,
			location: returnObj.location + '/resent-verification-email',
			message: 'Verification email sent'
		};

		try {
			// [VALIDATE]
			if (!validator.isAscii(req.body.email)) {
				return {
					...childReturnObj,
					message: 'Invalid params',
				}
			}

			// [READ][User] Get User by Email
			const user = await UserModel.findOne({ email: req.body.email })

			// [READ][VerificationCode] by user_id
			const vCode = await VerificationCodeCollection.c_read_byUser_id({
				user_id: user._id
			})
			
			// [SEND-MAIL]
			mailerUtil.sendVerificationMail(
				req.body.email,
				user._id,
				vCode.verificationCode.verificationCode
			)

			return {
				...childReturnObj,
				status: true
			}
			
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			}
		}
	},

	/**
	 * @notice Send the email for the password reset
	 * @param req.body.email Email to recover password for
	*/
	requestResetPassword: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/request-reset-password',
			message: 'Email sent'
		};

		console.log('s',req.body);

		try {
			// [VALIDATE]
			if (!validator.isEmail(req.body.email)) {
				return {
					...childReturnObj,
					message: `Invalid params`,
				};
			}

			// [MONGODB][FIND-ONE][User]
			const user = await UserModel.findOne({ email: req.body.email });
			
			if (!user) {
				return {
					...childReturnObj,
					message: 'No user found'
				};
			}

			// [CREATE][PasswordRecovery]
			const passwordRecovery = await PasswordRecoveryCollection.c_create(
				user._id
			);
			
			if (!passwordRecovery.status || passwordRecovery.existance) {
				return passwordRecovery;
			}

			// [SEND-MAIL]
			console.log('running');
			const sent = await mailerUtil.sendPasswordResetEmail(
				req.body.email,
				user._id,
				passwordRecovery.passwordRecovery.verificationCode
			);

			if (sent.status) {
				return {
					...childReturnObj,
					status: true
				};
			}
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			};
		}
	},

	/**
	 * @notice Reset Password
	 * @param req.body.user_id
	 * @param req.body.verificationCode Code sent to email
	 * @param req.body.password New password to be set
	*/
	resetPassword: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/reset-password',
			message: 'Password reset'
		};

		try {
			if (
				!validator.isAscii(req.body.user_id) ||
				!validator.isAscii(req.body.verificationCode) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					...childReturnObj,
					message: 'Invalid params',
				}
			}

			// [EXISTANCE][PasswordRecovery]
			const existance = await PasswordRecoveryCollection.c_existance(
				req.body.user_id
			)

			if (!existance.existance) {
				return {
					...childReturnObj,
					message: 'You have not made a request to reset your password',
				}
			}

			// [VALIDATE][PasswordRecovery]
			const pwdRecovery = await PasswordRecoveryCollection.c_validateToken(
				req.body.user_id,
				req.body.verificationCode
			)

			if (!pwdRecovery.status || !pwdRecovery.valid) { return pwdRecovery }

			// [MONGODB][UPDATE] user.password
			await UserModel.findOneAndUpdate(
				{ _id: req.body.user_id },
				{
					$set: {
						password: await bcrypt.hash(req.body.password, 10)
					}
				}
			)

			// [DELETE][PasswordRecovery]
			const deletedPR = await PasswordRecoveryCollection.c_delete_byUser(
				req.body.user_id
			)

			if (!deletedPR.status) { return deletedPR }

			return {
				...childReturnObj,
				status: true,
			}
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err
			}
		}
	},
}