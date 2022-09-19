// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const rh = require('./.handler.js');
const Auth = require('../../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


/**
 * [CRUD]
*/
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.update({ req }));
	}
);

router.post(
	'/update/workspace--web-app',
	Auth.userToken(),
	async (req, res) => {
		console.log('running');
		res.send(await rh.update_workspaceWebApp({ req }));
	}
);

router.post(
	'/update/password',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.update_password({ req }));
	}
);


/**
 * [OTHER]
*/
router.post(
	'/generate-api-key',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.generateApiKey({ req }));
	}
);


module.exports = router;