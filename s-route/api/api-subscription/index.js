// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const h = require('./.handler.js');
const Auth = require('../../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	'/update-pm',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.updatePm({ req }));
	}
);


router.post(
	'/delete-pm',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.deletePm({ req }));
	}
);


router.post(
	'/update-tier-0',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.updateTier0({ req }));
	}
);


router.post(
	'/update-tier-1',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.updateTier1({ req }));
	}
);


router.post(
	'/update-tier-2',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.updateTier2({ req }));
	}
);


module.exports = router;