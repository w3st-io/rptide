// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rh = require('./index.handler')
const rateLimiters = require('../../../s-rate-limiters')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.update({ req })) }
)


router.post(
	'/update-workspace-selected-web-app',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.updateWorkspaceSelectedWebApp({ req }));
	}
),


/******************* [LOGIN/REGISTRATION] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => { res.send(await rh.login({ req })) }
)


// [LOGIN] //
router.post(
	'/check-in',
	Auth.userTokenByPassVerification(),
	async (req, res) => { res.send(await rh.checkIn({ req })) }
)


// [REGISTRATION] //
router.post(
	'/register',
	rateLimiters.registration,
	async (req, res) => { res.send(await rh.register({ req })) }
)


router.post(
	'/complete-registration',
	async (req, res) => { res.send(await rh.completeRegistration({ req })) }
)


/******************* [VERIFICATION] *******************/
router.post(
	'/resend-verification-email',
	async (req, res) => { res.send(await rh.resendVerificationEmail({ req })) }
)


/******************* [PASSWORD] *******************/
router.post(
	'/change-password',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.changePassword({ req })) }
)


// Send the email for the password reset
router.post(
	'/request-reset-password',
	async (req, res) => { res.send(await rh.requestResetPassword({ req })) }
)


router.post(
	'/reset-password',
	async (req, res) => { res.send(await rh.resetPassword({ req })) }
)


/******************* [API-KEY] *******************/
router.post(
	'/generate-api-key',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.generateApiKey({ req })) }
)


module.exports = router