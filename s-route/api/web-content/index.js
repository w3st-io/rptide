// [REQUIRE]
const cors = require("cors");
const express = require("express");


// [REQUIRE] Personal
const h = require("./.handler.js");
const Auth = require("../../../s-middlewares/Auth");


// [EXPRESS + USE]
const router = express.Router().use(cors());


// [CREATE] Auth Required
router.post(
	"/create",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.create({ req }));
	}
);


// [FIND-ALL] Auth Required
router.post(
	"/find",
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await h["/find"]({ req }));
	}
);


// [FIND-ALL] Auth Required
router.post(
	"/find-paginated/:limit/:page",
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await h["/find-paginated/:limit/:page"]({ req }));
	}
);


// [FIND] Auth Required
router.post(
	"/find-one",
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await h["/find-one"]({ req }));
	}
);


// [UPDATE] Auth Required
router.post(
	"/find-one-and-update",
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await h["/find-one-and-update"]({ req }));
	}
);


// [UPDATE] Auth Required
router.post(
	"/delete-one",
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await h["/delete-one"]({ req }));
	}
);


module.exports = router;