// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const NotificationCollection = require('../../../s-collections/NotificationCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL][Notification] //
				const { notifications } = await NotificationCollection.c_readAll_sorted_byUser(
					req.user_decoded.user_id,
					sort,
					limit,
					skip
				)

				// [COUNT] postFollows //
				const {
					count: totalNotifications
				} = await NotificationCollection.c_count(req.user_decoded.user_id)
				

				// [COUNT] totalPages //
				const totalPages = Math.ceil(totalNotifications / limit)
				

				res.send({
					executed: true,
					status: true,
					notifications: notifications,
					totalNotifications: totalNotifications,
					totalPages,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/notifications',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/notifications',
				message: `Error --> ${err}`,
			})
		}
	},
)
	
	
module.exports = router