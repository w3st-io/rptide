// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const CommentCollection = require('../../../s-collections/CommentCollection')
const CommentLikeCollection = require('../../../s-collections/CommentLikeCollection')
const PostCollection = require('../../../s-collections/PostCollection')
const PostFollowCollection = require('../../../s-collections/PostFollowCollection')
const PostLikeCollection = require('../../../s-collections/PostLikeCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [DELETE] Auth Required //
router.delete(
	'/delete/:post_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.post_id)) {
				// [DELETE][posts] //
				const posts = await PostCollection.c_delete(req.params.post_id)

				// [DELETE][postFollows] //
				const postFollows = await PostFollowCollection.c_delete_byPost(
					req.params.post_id
				)

				// [DELETE-ALL][PostLikes] //
				const postLikes = await PostLikeCollection.c_delete_byPost(
					req.params.post_id
				)

				// [DELETE][Activity] Post & Comment //
				const activity = await ActivityCollection.c_delete_byPost(
					req.params.post_id
				)

				// [DELETE-ALL][Comment] //
				const comments = await CommentCollection.c_deleteAll_byPost({
					post_id: req.params.post_id
				})

				// [DELETE-ALL][CommentLike] //
				const commentLikes = await CommentLikeCollection.c_delete_byPost(
					req.params.post_id
				)

				if (
					posts.status &&
					postLikes.status &&
					activity.status &&
					comments.status
				) {
					// [SUCCESS] //
					res.send({
						executed: true,
						status: true,
						deleted: [
							posts,
							postFollows,
							postLikes,
							activity,
							comments,
							commentLikes
						]
					})
				}

			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/posts/delete',
					message: 'Invalid post_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/posts/delete',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router