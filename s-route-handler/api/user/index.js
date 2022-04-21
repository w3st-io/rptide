// [REQUIRE] //
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const PasswordRecoveryCollection = require('../../../s-collections/PasswordRecoveryCollection')
const UserReportCollection = require('../../../s-collections/UserReportCollection')
const UserCollection = require('../../../s-collections/UserCollection')
const VerificationCodeCollection = require('../../../s-collections/VerificationCodeCollection')
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection')
const api_stripe = require('../../../s-api/stripe')
const mailerUtil = require('../../../s-utils/mailerUtil')


// [INIT] //
const location = '/s-route-hander/api/user'


module.exports = {
	update: async ({ req }) => {
		try {
			// [VALIDATE] //
			if (!validator.isAscii(req.body.img_url)) {
				return {
					executed: true,
					status: false,
					location: `${location}`,
					message: 'Invalid params',
				}
			}

			const returned = await UserCollection.c_update({
				user_id: req.user_decoded.user_id,
				img_url: req.body.img_url,
				bio: req.body.bio
			})
	
			return returned
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}`,
				message: `Error --> ${err}`,
			}
		}
	},


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
				}
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
				}
			}

			// [READ][User] Get user by email //
			const userObj = await UserCollection.c_read_byEmail(req.body.email)

			if (!userObj.user) {
				return {
					executed: true,
					status: true,
					location: `${location}/login:`,
					message: `Invalid email or password`,
					validation: false
				}
			}

			// [VALIDATE-PASSWORD] //
			if (!bcrypt.compareSync(req.body.password, userObj.user.password)) {
				return {
					executed: true,
					status: true,
					location: `${location}/login:`,
					message: `Invalid email or password`,
					validation: false,
				}
			}

			const token = jwt.sign(
				{
					user_id: userObj.user._id,
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
			)
	
			return {
				executed: true,
				status: true,
				message: 'success',
				validation: true,
				token: token,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/login:`,
				message: `${location}/login: Error --> ${err}`,
			}
		}
	},


	register: async ({ req }) => {
		try {
			// [VALIDATE] //
			if (
				!validator.isAscii(req.body.username) ||
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
				username: req.body.username,
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
}