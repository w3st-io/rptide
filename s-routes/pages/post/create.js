// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const categories = require('../../../s-defaults/categories')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			res.send({
				executed: true,
				status: true,
				categories: categories,
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/post/create',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router