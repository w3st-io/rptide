// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiters = require('../../../s-rate-limiters')
const rh_api_admin = require('../../../s-route-handler/api/admin')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => { res.send(await rh_api_admin.login({ req })) }
)


// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registration,
	async (req, res) => { res.send(await rh_api_admin.register({ req })) }
)


module.exports = router