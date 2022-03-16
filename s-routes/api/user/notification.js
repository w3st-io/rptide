// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const NotificationCollection = require('../../../s-collections/NotificationCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] unread //
router.get(
	'/read-unread/:sort/:limit/:page',
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

				const { notifications } = await NotificationCollection.c_readAll_sorted_byUserAndUnread(
					req.user_decoded.user_id,
					sort,
					limit,
					skip,
				)

				const { count } = await NotificationCollection.c_count_byUnread(
					req.user_decoded.user_id,
				)

				res.send({
					executed: true,
					status: true,
					notifications: notifications,
					unreadNotificationCount: count,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/notifications/read-unread',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/notifications/read-unread',
				message: `Error --> ${err}`,
			})
		}
	}
)


/******************* [MARK-READ-STATUS] *******************/
// [UPDATE] set read to true //
router.get(
	'/mark-read/:notification_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.notification_id)) {
				const returned = await NotificationCollection.c_markRead(
					req.params.notification_id
				)

				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/notifications/mark-unread',
					message: 'Invalid notification_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/notifications/mark-unread',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router