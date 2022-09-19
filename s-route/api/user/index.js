// [REQUIRE]
const cors = require("cors");
const express = require("express");


// [REQUIRE] Personal
const h = require("./.handler.js");
const Auth = require("../../../s-middlewares/Auth");


// [EXPRESS + USE]
const router = express.Router().use(cors());


/**
 * [CRUD]
*/
router.post(
	"/update",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.update({ req }));
	}
);

router.post(
	"/update/workspace--web-app",
	Auth.userToken(),
	async (req, res) => {
		console.log("running");
		res.send(await h.update_workspaceWebApp({ req }));
	}
);

router.post(
	"/update/password",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.update_password({ req }));
	}
);

router.post(
	"/generate-api-key",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.generateApiKey({ req }));
	}
);

router.get(
	"/stripe-payment-method",
	async (req, res) => {
		res.send(await h["/stripe-payment-method"]({ req }));
	}
);


router.post(
	"/update/stripe-payment-method",
	Auth.userToken(),
	async (req, res) => {
		res.send(await h["/update/stripe-payment-method"]({ req }));
	}
);


module.exports = router;