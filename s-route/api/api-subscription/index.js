// [REQUIRE]
const cors = require("cors");
const express = require("express");


// [REQUIRE] Personal
const h = require("./.handler.js");
const Auth = require("../../../s-middlewares/Auth");


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	"/read/payment-method",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.read_paymentMethod({ req }));
	}
);


router.post(
	"/update/payment-method",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.update_paymentMethod({ req }));
	}
);


router.post(
	"/delete/payment-method",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.delete_paymentMethod({ req }));
	}
);


router.post(
	"/update/tier",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.update_tier({ req }));
	}
);


module.exports = router;