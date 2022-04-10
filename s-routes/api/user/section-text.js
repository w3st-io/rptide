// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const h_sectionText = require('../../../s-route-handler/sectionText')
const Auth = require('../../../s-middlewares/Auth')
const ApiSubscription = require('../../../s-middlewares/ApiSubscription')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	rateLimiter.post,
	Auth.userToken(),
	ApiSubscription.sectionTextLimitCheck(),
	async (req, res) => {
		res.send(
			await h_sectionText.createSectionText({
				user_id: req.user_decoded.user_id,
				title: req.body.title,
				cleanJSON: req.body.cleanJSON,
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
			await h_sectionText.deleteSectionText({
				user_id: req.user_decoded.user_id,
				sectionText_id: req.body.sectionText_id,
			})
		)
	}
)


module.exports = router