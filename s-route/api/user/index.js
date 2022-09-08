// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rh = require('./index.handler')
const rateLimiters = require('../../../s-rate-limiters')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.update({ req })) }
)


router.post(
	'/update-workspace-selected-web-app',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.updateWorkspacewebApp({ req }));
	}
),


/******************* [PASSWORD] *******************/
router.post(
	'/change-password',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.changePassword({ req })) }
)


/******************* [API-KEY] *******************/
router.post(
	'/generate-api-key',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.generateApiKey({ req })) }
)


module.exports = router