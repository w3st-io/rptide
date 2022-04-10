// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const h_user = require('../../../s-route-handler/user')
const rateLimiters = require('../../../s-rate-limiters')
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const PasswordRecoveryCollection = require('../../../s-collections/PasswordRecoveryCollection')
const UserReportCollection = require('../../../s-collections/UserReportCollection')
const UserCollection = require('../../../s-collections/UserCollection')
const VerificationCodeCollection = require('../../../s-collections/VerificationCodeCollection')
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection')
const Auth = require('../../../s-middlewares/Auth')
const api_stripe = require('../../../s-api/stripe')
const mailerUtil = require('../../../s-utils/mailerUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [INIT] //
const location = '/s-route/api/users'


/******************* [CRUD] *******************/
// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.img_url)) {
				const returned = await UserCollection.c_update({
					user_id: req.user_decoded.user_id,
					img_url: req.body.img_url,
					bio: req.body.bio
				})
		
				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}`,
					message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}`,
				message: `Error --> ${err}`,
			})
		}
	}
)


/******************* [LOGIN/REGISTRATION] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => {
		res.send(
			await h_user.login({
				email: req.body.email,
				password: req.body.password
			})
		)
	}
)


// [REGISTRATION] //
router.post(
	'/register',
	rateLimiters.registration,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.username) &&
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.password)
			) {
				// [CREATE][User] //
				const userObj = await UserCollection.c_register({
					username: req.body.username,
					email: req.body.email,
					password: req.body.password,
				})

				if (userObj.status && userObj.created) {
					// [CREATE][VerificationCode] //
					const vCodeObj = await VerificationCodeCollection.c_create({
						user_id: userObj.user._id
					})

					// [CREATE][ApiSubscription] //
					const subscriptionObj = await ApiSubscriptionCollection.c_create({
						user_id: userObj.user._id
					})

					// [CREATE][Activity] //
					const activityObj = await ActivityCollection.c_create({
						user_id: userObj.user._id,
						type: 'user',
						post_id: undefined,
						createdUser_id: userObj.user._id,
						createdPost_id: undefined,
						createdComment_id: undefined,
					})
					
					// [MAIL] Verification Email //
					await mailerUtil.sendVerificationMail(
						userObj.user.email,
						userObj.user._id,
						vCodeObj.verificationCode.verificationCode
					)

					res.send({
						executed: true,
						status: true,
						created: true,
					})
				}
				else { res.send(userObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/register:`,
					message: `${location}/register: Invalid Params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/register:`,
				message: `${location}/register: Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/complete-registration',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.user_id) &&
				validator.isAscii(req.body.verificationCode)
			) {
				// [EXISTANCE][VerificationCode] //
				const vCObj = await VerificationCodeCollection.c_validate({
					user_id: req.body.user_id,
					verificationCode: req.body.verificationCode
				})
				
				if (vCObj.status && vCObj.existance) {
					// [READ][User] Verify //
					const userObj = await UserCollection.c_read(req.body.user_id)

					// [API][stripe] Create stripe customer //
					const stripeObj = await api_stripe.aa_createCustomer({
						user_id: userObj.user._id,
						email: userObj.user.email,
						username: userObj.user.username,
					})

					if (stripeObj.status) {
						if (userObj.status && !userObj.user.verified) {
							// [UPDATE][User] Verify //
							await UserCollection.c_verify(req.body.user_id)

							// [READ][ApiSubscription] //
							const subscriptionObj = await ApiSubscriptionCollection.c_read_byUser({
								user_id: req.body.user_id
							})

							// [UPDATE][ApiSubscription] //
							const updatedApiSubscriptionObj = await ApiSubscriptionCollection.c_update_cusId({
								apiSubscription_id: subscriptionObj.apiSubscription._id,
								user_id: userObj.user._id,
								cusId: stripeObj.createdStripeCustomer.id,
							})

							if (updatedApiSubscriptionObj.status) {
								// [SUCCESS] //
								res.send({
									executed: true,	
									status: true,
									existance: vCObj.existance,
									createdStripeCustomer: stripeObj.createdStripeCustomer,
									createdStripePaymentMethod: stripeObj.createdStripePaymentMethod,
									attachedPaymentMethod: stripeObj.attachedPaymentMethod,
								})
							}
							else { res.send(updatedApiSubscriptionObj) }
						}
						else {
							res.send({
								executed: true,
								status: false,
								message: 'Something went wrong'
							})
						}
					}
					else { res.send(stripeObj) }
				}
				else { res.send(vCObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/complete-registration`,
					message: `${location}/complete-registration: Invalid params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/complete-registration`,
				message: `${location}/complete-registration: Error --> ${err}`,
			})
		}
	}
)


/******************* [VERIFICATION] *******************/
router.post(
	'/resend-verification-email',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.email)) {
				// [READ][User] Get User by Email //
				const user = await UserCollection.c_read_byEmail(req.body.email)

				// [READ][VerificationCode] by user_id //
				const vCode = await VerificationCodeCollection.c_read({
					user_id: user.user._id
				})
				
				// [SEND-MAIL] //
				mailerUtil.sendVerificationMail(
					req.body.email,
					user.user._id,
					vCode.verificationCode.verificationCode
				)

				res.send({
					executed: true,
					status: true,
					location: `${location}/resend-verification-email`,
					message: `Verification email sent`,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/resend-verification-email`,
					message: `${location}/resend-verification-email: Invalid params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/resend-verification-email`,
				message: `${location}/resend-verification-email: Error --> ${err}`,
			})
		}
	}
)


/******************* [PASSWORD] *******************/
router.post(
	'/change-password',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.currentPassword) &&
				validator.isAscii(req.body.password)
			) {
				const userObj = await UserCollection.c_read(
					req.user_decoded.user_id
				)
				
				if (userObj.status) {
					// [VALIDATE-PASSWORD] //
					if (bcrypt.compareSync(req.body.currentPassword, userObj.user.password)) {		
						// [UPDATE][User] Password //
						const updatedPwd = await UserCollection.c_update_password(
							req.user_decoded.user_id,
							req.body.password
						)

						res.send(updatedPwd) 
					}
					else {
						res.send({
							executed: true,
							status: false,
							location: `${location}/reset-password`,
							message: `${location}/reset-password: Invalid password`,
						})
					}
				}
				else {
					res.send(userObj)
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/reset-password`,
					message: `${location}/reset-password: Invalid Params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/reset-password`,
				message: `${location}/reset-password: Error --> ${err}`,
			})
		}
	}
)


// Send the email for the password reset
router.post(
	'/request-reset-password',
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.email)) {
				const user = await UserCollection.c_read_byEmail(req.body.email)
				
				if (user.status) {
					// [CREATE][PasswordRecovery] //
					const passwordRecovery = await PasswordRecoveryCollection.c_create(
						user.user._id
					)
					
					if (passwordRecovery.status && !passwordRecovery.existance) {
						// [SEND-MAIL] //
						const email = await mailerUtil.sendPasswordResetEmail(
							req.body.email,
							user.user._id,
							passwordRecovery.passwordRecovery.verificationCode
						)
						
						res.send(email)
					}
					else { res.send(passwordRecovery) }
				}
				else { res.send(user) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/request-reset-password:`,
					message: `${location}/request-reset-password: Invalid params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/request-reset-password:`,
				message: `${location}/request-reset-password: Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/reset-password',
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.user_id) &&
				validator.isAscii(req.body.verificationCode) &&
				validator.isAscii(req.body.password)
			) {
				// [EXISTANCE][PasswordRecovery] //
				const existance = await PasswordRecoveryCollection.c_existance(
					req.body.user_id
				)

				if (existance.existance) {
					// [VALIDATE][PasswordRecovery] //
					const pwdRecovery = await PasswordRecoveryCollection.c_validateToken(
						req.body.user_id,
						req.body.verificationCode
					)

					if (pwdRecovery.status && pwdRecovery.valid) {
						// [UPDATE][User] Password //
						const updatedPwd = await UserCollection.c_update_password(
							req.body.user_id,
							req.body.password
						)

						if (updatedPwd.status) {
							// [DELETE][PasswordRecovery] //
							const deletedPR = await PasswordRecoveryCollection.c_delete_byUser(
								req.body.user_id
							)

							if (deletedPR.status) {
								res.send({
									executed: true,
									status: true,
									location: `${location}/reset-password:`,
									message: `${location}/reset-password: Password reset`,
								})
							}
						}
						else { res.send(updatedPwd) }
					}
					else { res.send(pwdRecovery) }
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: `${location}/reset-password:`,
						message: `${location}/reset-password: Invalid params`,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/reset-password:`,
					message: `${location}/reset-password: You have not made a request to reset your password`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/reset-password:`,
				message: `${location}/reset-password: Error --> ${err}`,
			})
		}
	}
)


/******************* [REPORTS] *******************/
// [CREATE] Report //
router.post(
	'/report',
	Auth.userToken(),
	rateLimiters.report,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.reportType) &&
				validator.isAscii(req.body.reportedUser)
			) {
				// [FORMAT] //
				req.body.reportType = req.body.reportType.toLowerCase()

			
				// [EXISTANCE][UserReport] Do not double save //
				const existance = await UserReportCollection.c_existance_byUserAndReportedUser(
					req.user_decoded.user_id,
					req.body.reportedUser
				)

				if (existance.status && !existance.existance) {
					// [CREATE][CommentReport] //
					const userReport = await UserReportCollection.c_create(
						req.user_decoded.user_id,
						req.body.reportType,
						req.body.reportedUser
					)

					res.send(userReport)
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: `${location}`,
						message: existance.message,
						existance: existance.existance,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
						location: `${location}/report`,
						message: `${location}/report: Invalid params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/report`,
				message: `${location}/report: Error --> ${err}`,
			})
		}
	},
)


/******************* [API-KEY] *******************/
router.post(
	'/generate-api-key',
	Auth.userToken(),
	//rateLimiters.generateApiKey,
	async (req, res) => {
		const userObj = await UserCollection.c_read_select({
			user_id: req.user_decoded.user_id
		})

		const pk = await UserCollection.c_create_apiPrivateKey({
			user_id: userObj.user._id
		})

		res.send({
			executed: true,
			status: true,
			location: `${location}/generate-api-key`,
			privateKey: pk.privateKey
		})
	}
)


module.exports = router