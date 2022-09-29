// [REQUIRE]
const cors = require("cors");
const express = require("express");


// [REQUIRE] Personal
const h = require("./.handler.js");
const Auth = require("../../../s-middlewares/Auth");
const Functionality = require("../../../s-middlewares/Functionality");


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	"/update/workspace--web-app",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/update/workspace--web-app"]({ req }));
	}
);

router.post(
	"/update/password",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/update/password"]({ req }));
	}
);

router.post(
	"/generate-api-key",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/generate-api-key"]({ req }));
	}
);

router.post(
	"/update/tier",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/update/tier"]({ req }));
	}
);

router.post(
	"/stripe-payment-method",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/stripe-payment-method"]({ req }));
	}
);


router.post(
	"/stripe-payment-method-update",
	Auth.userToken(),
	Functionality.commerce(),
	async (req, res) => {
		res.send(await h["/stripe-payment-method-update"]({ req }));
	}
);

router.post(
	"/stripe-payment-method-delete",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/stripe-payment-method-delete"]({ req }));
	}
);


module.exports = router;