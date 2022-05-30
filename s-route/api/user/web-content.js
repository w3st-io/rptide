// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const rh = require('./web-content.handler')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.createWebContent({ req }))
	}
)


// [CREATE] Auth Required //
router.post(
	'/find',
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.find({ req }))
	}
)


module.exports = router