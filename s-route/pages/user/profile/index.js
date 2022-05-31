// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const UserCollection = require('../../../../s-collections/UserCollection')
const Auth = require('../../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - user_decoded //
router.get(
	'/index',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await UserCollection.c_read_select({
				user_id: req.user_decoded._id,
				select: '-password -api.publicKey'
			})
			
			if (userObj.status) {
				res.send({
					executed: true,
					status: true,
					user: userObj.user,
				})
			}
			else { res.send(userObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user/profile',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router