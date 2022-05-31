// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const UserCollection = require('../../../../s-collections/UserCollection')
const Auth = require('../../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await UserCollection.c_read_select({
				user_id: req.user_decoded._id,
				select: '_id first_name last_name username bio verified createdAt profile_img'
			})

			res.send(userObj)
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/read',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router