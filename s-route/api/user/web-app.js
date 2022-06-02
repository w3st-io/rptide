// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const rh = require('./web-app.handler')
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
			await rh.createWebApp({
				user_id: req.user_decoded._id,
				title: req.body.title,
			})
		)
	}
)


router.post(
	'find',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(await rh.find({ req }))	
	}
)
		
		
// [DELETE] Auth Required //
router.post(
	'/delete',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		res.send(
			await rh.deleteWebApp({
				user_id: req.user_decoded._id,
				webApp_id: req.body.webApp_id,
			})
		)
	}
)


module.exports = router