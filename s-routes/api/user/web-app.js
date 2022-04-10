// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const h_webApp = require('../../../s-route-handler/webApps')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(
			await h_webApp.createWebApp({
				user_id: req.user_decoded.user_id,
				title: req.body.title,
			})
		)
	}
)
		
		
// [DELETE] Auth Required //
router.post(
	'/delete',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(
			await h_webApp.deleteWebApp({
				user_id: req.user_decoded.user_id,
				webApp_id: req.body.webApp_id,
			})
		)
	}
)


module.exports = router