// [REQUIRE]
import cors from 'cors';
import express from 'express';

// [REQUIRE] Personal //
import config from '../../s-config';


// [REQUIRE] Personal
const h = require('./.handler.js');


// [EXPRESS + USE]
const router = express.Router().use(cors());


// [MAIN-ROUTE]
router.get(
	'/',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.index({ req }));
	}
);


router.post(
	'/login',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.login({ req }));
	}
);


router.post(
	'/register',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.register({ req }));
	}
);


router.post(
	'/complete-registration',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.completeRegistration({ req }));
	}
);


router.post(
	'/resend-verification-email',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.resendVerificationEmail({ req }));
	}
);


router.post(
	'/request-reset-password',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.requestResetPassword({ req }));
	}
);


router.post(
	'/reset-password',
	async (req: express.Request, res: express.Response) => {
		res.send(await h.resetPassword({ req }));
	}
);


module.exports = router;