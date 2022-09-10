// [REQUIRE] //
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal //
const rh = require('./index.handler');
const Auth = require('../../../s-middlewares/Auth');


// [EXPRESS + USE] //
const router = express.Router().use(cors());


/**
 * @notice [CRUD]
*/
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.update({ req }));
	}
);

router.post(
	'/update/workspace-selected-web-app',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.update_workspacewebApp({ req }));
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
 * @notice Generate API key
*/
router.post(
	'/generate-api-key',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.generateApiKey({ req }));
	}
);


module.exports = router;