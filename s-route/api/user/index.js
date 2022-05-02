// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rh_api_user = require('../../../s-route-handler/api/user')
const rateLimiters = require('../../../s-rate-limiters')
const PasswordRecoveryCollection = require('../../../s-collections/PasswordRecoveryCollection')
const UserReportCollection = require('../../../s-collections/UserReportCollection')
const UserCollection = require('../../../s-collections/UserCollection')
const Auth = require('../../../s-middlewares/Auth')
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
	async (req, res) => { res.send(await rh_api_user.update({ req })) }
)


/******************* [LOGIN/REGISTRATION] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => { res.send(await rh_api_user.login({ req })) }
)


// [REGISTRATION] //
router.post(
	'/register',
	rateLimiters.registration,
	async (req, res) => { res.send(await rh_api_user.register({ req })) }
)


router.post(
	'/complete-registration',
	async (req, res) => { res.send(await rh_api_user.completeRegistration({ req })) }
)


/******************* [VERIFICATION] *******************/
router.post(
	'/resend-verification-email',
	async (req, res) => {
		res.send(await rh_api_user.resendVerificationEmail({ req }))
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
							location: `${location}/change-password`,
							message: `Invalid password`,
						})
					}
				}
				else { res.send(userObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/change-password`,
					message: `Invalid Params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/change-password`,
				message: `Error --> ${err}`,
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