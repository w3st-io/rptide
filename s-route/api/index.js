// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const config = require('../../s-config')
const Auth = require('../../s-middlewares/Auth')
const WebAppModel = require('../../s-models/WebAppModel')
const UserModel = require('../../s-models/UserModel')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// [INIT] //
		const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
	
		const webApps = await WebAppModel.find({ user: user_id })

		const user = await UserModel.findOne({ _id: user_id })

		console.log(user);

		res.send({
			executed: true,
			status: true,
			node_env: config.NODE_ENV,
			webApps: webApps,
			//api: user.api || ''
		})
	}
)


module.exports = router