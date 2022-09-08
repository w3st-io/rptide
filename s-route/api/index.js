// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const rh = require('./index.handler');
const Auth = require('../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		res.send(await rh.index({ req }));
	}
);


// [LOGIN]
router.post(
	'/login',
	async (req, res) => {
		res.send(await rh.login({ req }));
	}
)


// [REGISTER]
router.post(
	'/register',
	async (req, res) => {
		res.send(await rh.register({ req }));
	}
)


router.post(
	'/complete-registration',
	async (req, res) => {
		res.send(await rh.completeRegistration({ req }));
	}
)


// [VERIFICATION]
router.post(
	'/resend-verification-email',
	async (req, res) => {
		res.send(await rh.resendVerificationEmail({ req }));
	}
)


// [PASSWORD]
// Send the email for the password reset
router.post(
	'/request-reset-password',
	async (req, res) => {
		res.send(await rh.requestResetPassword({ req }));
	}
)


router.post(
	'/reset-password',
	async (req, res) => {
		res.send(await rh.resetPassword({ req }));
	}
)


module.exports = router;