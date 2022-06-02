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
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await rh.find({ req }))
	}
)


// [CREATE] Auth Required //
router.post(
	'/find-one',
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await rh.findOne({ req }))
	}
)


// [CREATE] Auth Required //
router.post(
	'/find-one-and-update',
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		res.send(await rh.findOneAndUpdate({ req }))
	}
)


module.exports = router