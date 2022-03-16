// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const BlogPostCollection = require('../../../s-collections/BlogPostCollection')
const CommentCollection = require('../../../s-collections/CommentCollection')
const Auth = require('../../../s-middlewares/Auth')
const ApiSubscription = require('../../../s-middlewares/ApiSubscription')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


const location = '/s-api/user/blog-post'


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	rateLimiter.post,
	Auth.userToken(),
	ApiSubscription.blogPostLimitCheck(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				req.body.title &&
				req.body.cleanJSON
			) {
				// [CREATE][BlogPost] //
				const bPObj = await BlogPostCollection.c_create({
					user_id: req.user_decoded.user_id,
					title: req.body.title,
					cleanJSON: req.body.cleanJSON
				})

				if (bPObj.status) {
					// [CREATE][Activity] //
					const bPActivity = await ActivityCollection.c_create({
						user_id: req.user_decoded.user_id,
						type: 'blogPost',
						blogPost_id: bPObj.createdBlogPost._id,
						createdBlogPost_id: bPObj.createdBlogPost._id,
						createdComment_id: undefined,
						createdPost_id: undefined,
						createdUser_id: undefined,
					})

					if (bPActivity.status) {
						// [SUCCESS] //
						res.send({
							executed: true,
							status: true,
							createdBlogPost: bPObj.createdBlogPost,
							blogPostActivity: bPActivity,
						})
					}
					else { res.send(bPActivity) }
				}
				else { res.send(bPObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/create`,
					message: `${location}: Invalid Params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/create`,
				message: `${location}: Error --> ${err}`,
			})
		}
	}
)


router.post(
	'/delete',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.blogPost_id)) {
				// [DELETE][Post] //
				const deletePostObj = await BlogPostCollection.c_deleteOne_byIdAndUser({
					blogPost_id: req.body.blogPost_id,
					user_id: req.user_decoded.user_id
				})

				if (deletePostObj.status) {
					// [DELETE][Comments] //
					const deleteCommentsObj = await CommentCollection.c_deleteAll_byPost({
						blogPost_id: req.body.blogPost_id
					})

					if (deleteCommentsObj.status) {
						res.send({
							executed: true,
							status: true,
							location: location,
							message: 'Blog Post Deleted',
						})
					}
					else { res.send(deleteCommentsObj) }
				}
				else { res.send(deletePostObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/delete`,
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/create`,
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router