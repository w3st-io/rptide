// [IMPORT]
import express from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

// [IMPORT] Personal
import config from "../../s-config";
import config_const from "../../s-config/const";
import PasswordRecoveryModel, { IPasswordRecovery } from "../../s-models/PasswordRecovery.model";
import VerificationCodeModel, { IVerificationCode } from "../../s-models/VerificationCode.model";
import UserModel, { IUser } from "../../s-models/User.model";
import WebAppModel, { IWebApp } from "../../s-models/WebApp.model";
import mailerUtil from "../../s-utils/mailerUtil";


// [REQUIRE]
const jsonWebToken = require("jsonwebtoken");
const stripe = require("stripe");


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
	"/": async (req: express.Request): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			node_env: config.nodeENV,
			limit: config_const.limit,
			location: returnObj.location + ""
		};

		try {
			// [USER-LOGGED]
			if (req.body.user_decoded) {
				// [MONGODB][User]
				const user: IUser = await UserModel.findOne({
					_id: req.body.user_decoded._id
				}).select("-password -api.publicKey");

				// [MONGODB][WebApp]
				const webApps: IWebApp[] = await WebAppModel.find({
					user: req.body.user_decoded._id
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
	"/login": async (req: express.Request): Promise<object> => {
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
			const user: IUser = await UserModel.findOne({ email: req.body.email });
			
			if (!user) {
				return {
					..._returnObj,
					message: "Invalid email or password"
				};
			}

			// [VALIDATE-PASSWORD]
			if (!await user.comparePassword(req.body.password)) {
				return {
					..._returnObj,
					message: "Invalid email or password"
				};
			}

			// [JWT] Generate
			const token = jsonWebToken.sign(
				{
					_id: user._id,
					email: user.email,
					verified: user.verified
				},
				config.app.secretKey,
				{ expiresIn: config.nodeENV == "production" ? 7200 : 10000000 }
			);

			const webApps: IWebApp[] = await WebAppModel.find({ user: user._id });

			const cleanUser: IUser = await UserModel.findOne(
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
	"/register": async (req: express.Request): Promise<object> => {
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
				password: req.body.password
			}).save();

			// [MONGODB][SAVE][VerificationCode]
			const verificationCode = await new VerificationCodeModel({
				_id: new mongoose.Types.ObjectId(),
				user: user._id,
				verificationCode: uuidv4(),
			}).save();
			
			// [MAIL] Verification Email
			await mailerUtil.sendVerificationMail(
				user.email,
				user._id,
				verificationCode.verificationCode
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
	"/complete-registration": async (req: express.Request): Promise<object> => {
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
			const queryResult: IVerificationCode = await VerificationCodeModel.findOne({
				user: req.body.user_id,
				verificationCode: req.body.verificationCode
			});

			// [NOTHING-FOUND]
			if (!queryResult) {
				return {
					..._returnObj,
					message: "No VerificationCode object found",
				};
			}

			// [MONGODB][READ] User
			const user: IUser = await UserModel.findOne({ _id: req.body.user_id })
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
	 * @notice Send the email for the password reset
	 * @param req.body.email Email to recover password for
	*/
	"/request-reset-password": async (req: express.Request): Promise<object> => {
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
			const user: IUser = await UserModel.findOne({ email: req.body.email });
			
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
				verificationCode: uuidv4()
			}).save()

			// [SEND-MAIL]
			const attemptSendObj = await mailerUtil.sendPasswordResetEmail(
				req.body.email,
				user._id,
				passwordRecovery.verificationCode
			);

			if (!attemptSendObj.status) {
				return attemptSendObj;
			}

			// [200] Success
			return {
				..._returnObj,
				status: true,
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
	"/reset-password": async (req: express.Request): Promise<object> => {
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

			// [MONGODB][findOne][PasswordRecovery]
			const validPasswordRecovery: IPasswordRecovery = await PasswordRecoveryModel.findOne({
				user: req.body.user_id,
				verificationCode: req.body.verificationCode
			})

			if (!validPasswordRecovery) {
				return {
					..._returnObj,
					message: "Invalid Password Recovery verificationCode"
				};
			}

			// [MONGODB][UPDATE] user.password
			await UserModel.findOneAndUpdate(
				{ _id: req.body.user_id },
				{
					$set: {
						password: req.body.password
					}
				},
				{ new: true }
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