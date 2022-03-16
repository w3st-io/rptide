// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const CommentCollection = require('../../../s-collections/CommentCollection')
const CommentLikeCollection = require('../../../s-collections/CommentLikeCollection')
const NotificationCollection = require('../../../s-collections/NotificationCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [DELETE] Auth Required //
router.delete(
	'/delete/:comment_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALDIATE] //
			if (validator.isAscii(req.params.comment_id)) {
				// [DELETE][Comment] //
				const comment = await CommentCollection.c_delete(
					req.params.comment_id
				)

				if (comment.status) {
					// [DELETE][CommentLike] //
					const commentLikes = await CommentLikeCollection.c_deleteAll_byComment(
						req.params.comment_id
					)

					// [DELETE][Notifications] //
					const notifications = await NotificationCollection.c_deleteAll_byComment(
						req.params.comment_id
					)

					// [DELETE][Activity] //
					const activity = await ActivityCollection.c_deleteAll_byComment(
						req.params.comment_id
					)
	
					res.send({
						executed: true,
						status: true,
						deleted: [comment, commentLikes, notifications, activity],
					})
				}
				else { res.send(comment) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/comments/delete',
					message: 'Error --> Invalid comment_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
					location: '/api/admin/comments/delete',
					message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router