// [REQUIRE] //
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal //
const config = require('../../s-config');
const Auth = require('../../s-middlewares/Auth');
const WebAppModel = require('../../s-models/WebAppModel');


// [EXPRESS + USE] //
const router = express.Router().use(cors());


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [INIT]
		let returnObj = {
			node_env: config.nodeENV
		};

		// [USER-LOGGED]
		if (req.user_decoded) {
			// [INIT] //
			const webApps = await WebAppModel.find({ user: req.user_decoded._id })
			
			// [APPEND]
			returnObj = {
				...returnObj,
				webApps: webApps,
			}
		}

		// [SEND] 200
		res.status(200).send({
			status: true,
			executed: true,
			...returnObj
		})
	}
)


module.exports = router