// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const rateLimiter = require('../../../s-rate-limiters');
const rh = require('./.handler.js');
const ApiSubscription = require('../../../s-middlewares/ApiSubscription');
const Auth = require('../../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


/******************* [CRUD] *******************/
// [CREATE] Auth Required
router.post(
	'/create',
	rateLimiter.post,
	Auth.userToken(),
	ApiSubscription.webAppLimitCheck(),
	async (req, res) => {
		res.send(await rh.create({ req }));
	}
);


router.post(
	'/find-one',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.findOne({ req }));
	}
);


// [UPDATE] Auth Required
router.post(
	'/find-one-and-update',
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await rh.findOneAndUpdate({ req }));
	}
);
		
		
// [DELETE] Auth Required
router.post(
	'/delete-one',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.deleteOne({ req }));
	}
);


module.exports = router;