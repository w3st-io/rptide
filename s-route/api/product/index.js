// [REQUIRE]
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal
const { create, deleteOne, find, findOne, update } = require('./.handler.js')
const Auth = require('../../../s-middlewares/Auth')
const TierChecker = require('../../../s-middlewares/TierChecker')


// [EXPRESS + USE]
const router = express.Router().use(cors())


router.post(
	'/create',
	Auth.userToken(),
	TierChecker.productLimitCheck(),
	async (req, res) => {
		res.send(await create({ req }));
	}
);


router.post(
	'/find',
	Auth.userToken(),
	async (req, res) => {
		res.send(await find({ req }));
	}
);


router.post(
	'/find-one',
	Auth.userToken(),
	async (req, res) => {
		res.send(await findOne({ req }));
	}
);


router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		res.send(await update({ req }));
	}
);


router.post(
	'/delete-one',
	Auth.userToken(),
	async (req, res) => {
		res.send(await deleteOne({ req }));
	}
);


module.exports = router;