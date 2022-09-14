// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const h = require('./.handler.js');
const Auth = require('../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		res.send(await h.index({ req }));
	}
);


router.post(
	'/login',
	async (req, res) => {
		res.send(await h.login({ req }));
	}
);


router.post(
	'/register',
	async (req, res) => {
		res.send(await h.register({ req }));
	}
);


router.post(
	'/complete-registration',
	async (req, res) => {
		res.send(await h.completeRegistration({ req }));
	}
);


router.post(
	'/resend-verification-email',
	async (req, res) => {
		res.send(await h.resendVerificationEmail({ req }));
	}
);


router.post(
	'/request-reset-password',
	async (req, res) => {
		res.send(await h.requestResetPassword({ req }));
	}
);


router.post(
	'/reset-password',
	async (req, res) => {
		res.send(await h.resetPassword({ req }));
	}
);


module.exports = router;