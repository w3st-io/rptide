// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const Auth = require('../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [INIT] //
			const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
			
			res.send({
				executed: true,
				status: true,
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router