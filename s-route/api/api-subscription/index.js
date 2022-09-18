// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const h = require('./.handler.js');
const Auth = require('../../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	'/payment-method/update',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.paymentMethod_update({ req }));
	}
);


router.post(
	'/payment-method/delete',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.paymentMethod_delete({ req }));
	}
);


router.post(
	'/tier/update',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.tier_update({ req }));
	}
);


module.exports = router;