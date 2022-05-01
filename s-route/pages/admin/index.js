// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const UserCollection = require('../../../s-collections/UserCollection')
const Auth = require('../../../s-middlewares/Auth')
const socketService = require('../../../s-socket/socketService')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/index',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [INIT] Const //
			const userSockets = socketService.getAllUserSockets()

			// [INIT] //
			let users = []

			// Users Online //
			for (let i = 0; i < userSockets.length; i++) {
				const user = await UserCollection.c_read_select({
					user_id: userSockets[i].user_id,
					select: 'username email'
				})

				users.push(user.user)
			}

			res.send({
				executed: true,
				status: true,
				users: users,
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/admin',
				message: `/pages/admin: Error --> ${err}`,
			})
		}
	}
)


module.exports = router