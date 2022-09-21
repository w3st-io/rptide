// [REQUIRE]
const cors = require("cors");
const express = require("express");


// [REQUIRE] Personal
const rateLimiter = require("../../../s-rate-limiters");
const h = require("./.handler.js");
const TierChecker = require("../../../s-middlewares/TierChecker");
const Auth = require("../../../s-middlewares/Auth");


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	"/create",
	rateLimiter.post,
	Auth.userToken(),
	TierChecker.webAppLimitCheck(),
	async (req, res) => {
		res.send(await h.create({ req }));
	}
);


router.post(
	"/find-one",
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.findOne({ req }));
	}
);


// [UPDATE] Auth Required
router.post(
	"/find-one-and-update",
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await h.findOneAndUpdate({ req }));
	}
);
		
		
// [DELETE] Auth Required
router.post(
	"/delete-one",
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.deleteOne({ req }));
	}
);


module.exports = router;