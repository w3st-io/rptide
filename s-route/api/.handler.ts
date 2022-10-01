// [IMPORT]
import mongoose from "mongoose";
import uuid from "uuid";
import validator from "validator";

// [IMPORT] Personal
import config from "../../s-config";
import config_const from "../../s-config/const";
import PasswordRecoveryModel from "../../s-models/PasswordRecovery.model";
import UserModel from "../../s-models/User.model";
import WebAppModel from "../../s-models/WebApp.model";


// [REQUIRE]
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe");


// [REQUIRE] Personal
const PasswordRecoveryCollection = require("../../s-collections/PasswordRecoveryCollection");
const VerificationCodeCollection = require("../../s-collections/VerificationCodeCollection");
const mailerUtil = require("../../s-utils/mailerUtil");


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey);


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	location: "/api",
	message: ""
};


export default {
	/**
	 * @notice Default route to initialize app
	 * @returns {Object}
	*/
	index: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			node_env: config.nodeENV,
			limit: config_const.limit,
			location: returnObj.location + ""
		};

		try {
			// [USER-LOGGED]
			if (req.user_decoded) {
				// [MONGODB][User]
				const user = await UserModel.findOne({
					_id: req.user_decoded._id
				}).select("-password -api.publicKey");

				// [MONGODB][WebApp]
				const webApps = await WebAppModel.find({
					user: req.user_decoded._id
				});
				
				// [APPEND]
				_returnObj = {
					..._returnObj,
					user: user,
					webApps: webApps
				};
			}
			
			// [200] Success
			return {
				..._returnObj,
				status: true
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	/**
	 * @notice Login
	 * @param {string} req.body.email Email tied to account
	 * @param {string} req.body.password Password for account
	 * @returns {string} Object containing token (JWT token)
	*/
	login: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/login",
			message: "Success",
			validation: false
		};

		try {
			// [VALIDATE] email
			if (!validator.isEmail(req.body.email)) {
				return {
					..._returnObj,
					message: "Invalid email",
				};
			}
				
			// [VALIDATE] password
			if (!validator.isAscii(req.body.password)) {
				return {
					..._returnObj,
					message: "Invalid password",
				};
			}

			// [READ][User] Get user by email
			const user = await UserModel.findOne({ email: req.body.email }).exec();

			if (!user) {
				return {
					..._returnObj,
					message: "Invalid email or password"
				};
			}

			// [VALIDATE-PASSWORD]
			if (!bcrypt.compareSync(req.body.password, user.password)) {
				return {
					..._returnObj,
					message: "Invalid email or password"
				};
			}

			// [JWT] Generate
			const token = jwt.sign(
				{
					_id: user._id,
					email: user.email,
					verified: user.verified
				},
				config.app.secretKey,
				{ expiresIn: config.nodeENV == "production" ? 7200 : 10000000 }
			);

			const webApps = await WebAppModel.find({ user: user._id });

			const cleanUser = await UserModel.findOne(
				{ email: req.body.email }
			).select("-password -api.publicKey");

			// [200] Success
			return {
				..._returnObj,
				status: true,
				validation: true,
				token: token,
				user: cleanUser,
				webApps: webApps
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	/**
	 * @notice Register
	 * @param {string} req.body.email
	 * @param {string} req.body.password Password for account
	*/
	register: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/register",
			message: "Successfully created account",
			created: false
		};

		try {
			// [VALIDATE] req.body.email
			if (!validator.isEmail(req.body.email)) {
				return {
					..._returnObj,
					message: "Invalid email"
				};
			}

			// Email Check
			if (await UserModel.findOne({ email: req.body.email })) {
				return {
					..._returnObj,
					message: "That email is already registered"
				};
			}
	
			// [VALIDATE] req.body.password
			if (
				!validator.isAscii(req.body.password) ||
				req.body.password < 8 ||
				req.body.password.length > 500
			) {
				return {
					..._returnObj,
					message: "Password Must be ASCII & longer than 8 characters"
				};
			}

			// [MONGODB][SAVE][User]
			const user = await new UserModel({
				_id: new mongoose.Types.ObjectId(),
				email: req.body.email,
				password: await bcrypt.hash(req.body.password, 10)
			}).save();

			// [MONGODB][CREATE][VerificationCode]
			const vCodeObj = await VerificationCodeCollection.c_create({
				user_id: user._id
			});
			
			// [MAIL] Verification Email
			await mailerUtil.sendVerificationMail(
				user.email,
				user._id,
				vCodeObj.verificationCode.verificationCode
			);

			// [200] Success
			return {
				..._returnObj,
				status: true,
				created: true,
				user: user
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	/**
	 * @notice Complete Registration
	 * @param {string} req.body.user_id
	 * @param {string} req.body.req.body.verificationCode
	*/
	completeRegistration: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/complete-registration",
			message: "Completed registration"
		};

		try {
			// [VALIDATE] user_id
			if (!mongoose.isValidObjectId(req.body.user_id)) {
				return {
					..._returnObj,
					message: "Invalid user_id"
				};
			}

			// [VALIDATE] verificationCode
			if (!validator.isAscii(req.body.verificationCode)) {
				return {
					..._returnObj,
					message: "Invalid verfication code"
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
			const user = await UserModel.findOne({ _id: req.body.user_id })
				.select("-password -api.publicKey")
			.exec();

			if (!user) {
				return {
					..._returnObj,
					message: "No User found"
				};
			};

			// if no cusId 
			if (user.stripe.cusId == "" || user.stripe.cusId == null) {
				// [API][stripe] Create customer
				const createdStripeCustomer = await Stripe.customers.create({
					email: user.email,
					metadata: { user_id: `${user._id}` },
				});

				// [UPDATE][User]
				await UserModel.findOneAndUpdate(
					{ _id: req.body.user_id },
					{
						$set: {
							verified: true,
							"stripe.cusId": createdStripeCustomer.id,
						}
					}
				);
			}

			// [200] Success
			return {
				..._returnObj,
				status: true,
				existance: vCObj.existance
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	/**
	 * @notice Resend verification email
	 * @param req.body.email Email to recover password for
	*/
	resendVerificationEmail: async ({ req }: any) => {
		let _returnObj: any = {
			executed: true,
			status: false,
			location: returnObj.location + "/resent-verification-email",
			message: "Verification email sent"
		};

		try {
			// [VALIDATE]
			if (!validator.isEmail(req.body.email)) {
				return {
					..._returnObj,
					message: "Invalid params",
				}
			}

			// [READ][User] Get User by Email
			const user = await UserModel.findOne({ email: req.body.email })

			if (!user) {
				return {
					..._returnObj,
					message: "No User found"
				};
			};

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
				..._returnObj,
				status: true
			}
			
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			}
		}
	},

	/**
	 * @notice Send the email for the password reset
	 * @param req.body.email Email to recover password for
	*/
	requestResetPassword: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/request-reset-password",
			message: "Email sent"
		};

		try {
			// [VALIDATE]
			if (!validator.isEmail(req.body.email)) {
				return {
					..._returnObj,
					message: `Invalid params`,
				};
			}

			// [MONGODB][FIND-ONE][User]
			const user = await UserModel.findOne({ email: req.body.email });
			
			if (!user) {
				return {
					..._returnObj,
					message: "No user found"
				};
			}

			// [SAVE]
			const passwordRecovery = await new PasswordRecoveryModel({
				_id: new mongoose.Types.ObjectId(),
				user: user._id,
				verificationCode: uuid.v4()
			}).save()

			// [SEND-MAIL]
			const sent = await mailerUtil.sendPasswordResetEmail(
				req.body.email,
				user._id,
				passwordRecovery.verificationCode
			);

			if (sent.status) {
				return {
					..._returnObj,
					status: true
				};
			}
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	/**
	 * @notice Reset Password
	 * @param req.body.user_id
	 * @param req.body.verificationCode Code sent to email
	 * @param req.body.password New password to be set
	*/
	resetPassword: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/reset-password",
			message: "Password reset"
		};

		try {
			if (
				!validator.isAscii(req.body.user_id) ||
				!validator.isAscii(req.body.verificationCode) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					..._returnObj,
					message: "Invalid params",
				};
			}

			// [EXISTANCE][PasswordRecovery]
			const existance = await PasswordRecoveryCollection.c_existance(
				req.body.user_id
			);

			if (!existance.existance) {
				return {
					..._returnObj,
					message: "You have not made a request to reset your password",
				};
			}

			// [VALIDATE][PasswordRecovery]
			const pwdRecovery = await PasswordRecoveryCollection.c_validateToken(
				req.body.user_id,
				req.body.verificationCode
			);

			if (!pwdRecovery.status || !pwdRecovery.valid) { return pwdRecovery; }

			// [MONGODB][UPDATE] user.password
			await UserModel.findOneAndUpdate(
				{ _id: req.body.user_id },
				{
					$set: {
						password: await bcrypt.hash(req.body.password, 10)
					}
				}
			);

			// [DELETE][PasswordRecovery]
			await PasswordRecoveryModel.deleteMany({ user: req.body.user_id });

			return {
				..._returnObj,
				status: true,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},
}