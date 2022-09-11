// [REQUIRE]
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal
const rh = require('./index.handler')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE]
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - user_decoded //
router.get(
	'/index',
	Auth.userTokenByPassVerification(),
	async (req, res) => { res.send(await rh.index({ req })) }
)


module.exports = router