// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const PostCollection = require('../../../s-collections/PostCollection')
const PostFollowCollection = require('../../../s-collections/PostFollowCollection')
const PostLikeCollection = require('../../../s-collections/PostLikeCollection')
const CommentCollection = require('../../../s-collections/CommentCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


const location = '/s-api/user/posts'


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	rateLimiter.post,
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.cat_id) &&
				req.body.title &&
				req.body.cleanJSON
			) {
				// [CREATE][Post] //
				const post = await PostCollection.c_create(
					req.user_decoded.user_id,
					req.body.cat_id,
					req.body.title
				)

				if (post.status) {
					// [CREATE][Activity] //
					const pActivity = await ActivityCollection.c_create({
						user_id: req.user_decoded.user_id,
						type: 'post',
						post_id: post.createdPost._id,
						createdUser_id: undefined,
						createdPost_id: post.createdPost._id,
						createdComment_id: undefined,
					})

					if (pActivity.status) {
						// [CREATE][Comment] //
						const comment = await CommentCollection.c_create({
							user_id: req.user_decoded.user_id,
							post_id: post.createdPost._id,
							cleanJSON: req.body.cleanJSON,
						})

						if (comment.status) {
							// [CREATE][Activity] //
							const cActivity = await ActivityCollection.c_create({
								user_id: req.user_decoded.user_id,
								type: 'comment',
								post_id: comment.comment.post,
								createdUser_id: undefined,
								createdPost_id: undefined,
								createdComment_id: comment.comment._id,
							})
						
							if (cActivity.status) {
								// [SUCCESS] //
								res.send({
									executed: true,
									status: true,
									post: post,
									comment: comment,
									postActivity: pActivity,
									commentActivity: cActivity,
								})
							}
							else { res.send(cActivity) }
						}
						else { res.send(comment) }
					}
					else { res.send(pActivity) }
				}
				else { res.send(post) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/create',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/create',
				message: `Error --> ${err}`,
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
			if (validator.isAscii(req.body.post_id)) {
				// [DELETE][Post] //
				const deletePostObj = await PostCollection.c_deleteOne_byIdAndUser({
					post_id: req.body.post_id,
					user_id: req.user_decoded.user_id
				})

				if (deletePostObj.status) {
					// [DELETE][Comment] //
					const deleteCommentsObj = await CommentCollection.c_deleteAll_byPost({
						post_id: req.body.post_id
					})

					if (deleteCommentsObj.status) {
						res.send({
							executed: true,
							status: true,
							location: location,
							message: 'Post Deleted',
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


/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like',
	rateLimiter.like,
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.postUser_id)
			) {
				// [EXISTANCE][PostLike] //
				const existance = await PostLikeCollection.c_existance(
					req.user_decoded.user_id,
					req.body.post_id,
				)

				if (!existance.existance) {
					// [CREATE][PostLike] //
					const postLikeObj = await PostLikeCollection.c_create(
						req.user_decoded.user_id,
						req.body.post_id,
						req.body.postUser_id
					)

					if (postLikeObj.status) {
						// [UPDATE][Post] likeCount //
						const post = await PostCollection.c_incrementLike(
							req.body.post_id
						)

						res.send({
							executed: true,
							status: true,
							postLike: postLikeObj,
							post: post
						})
					}
					else { res.send(200).send(postLikeObj) }
				}
				else { res.send({
					executed: true,
					status: false,
					message: existance.message
				}) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/like`,
					message: 'Invalid post _id'
				})
			}
		} 
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/like`,
				message: `Error --> ${err}`
			})
		}
	},
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike',
	rateLimiter.like,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.post_id)) {
				const existance = await PostLikeCollection.c_existance(
					req.user_decoded.user_id,
					req.body.post_id
				)

				if (existance.existance) {
					// [CREATE][PostLike] //
					const postLikeObj = await PostLikeCollection.c_delete_byUserAndPost(
						req.user_decoded.user_id,
						req.body.post_id
					)
					
					if (postLikeObj.status) {
						// [UPDATE][Post] likeCount //
						const post = await PostCollection.c_decrementLike(
							req.body.post_id
						)

						res.send({
							executed: true,
							status: true,
							postLike: postLikeObj,
							post: post
						})
					}
					else { res.send(200).send(postLikeObj) }
				}
				else { res.send(existance) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/unlike',
					message: 'Invalid post_id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/unlike',
				message: `Error --> ${err}`,
			})
		}
	},
)


/******************* [FOLLOW-SYSTEM] *******************/
// [FOLLOW] Auth Required //
router.post(
	'/follow',
	rateLimiter.follow,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.post_id)) {
				// [CREATE]][PostFollow] //
				const returned = await PostFollowCollection.c_create(
					req.user_decoded.user_id,
					req.body.post_id
				)
				
				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/follow',
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/follow',
				message: `Error --> ${err}`
			})
		}
	},
)


// [UNFOLLOW] Auth Required //
router.post(
	'/unfollow',
	rateLimiter.follow,
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.post_id)) {
				const pFObj = await PostFollowCollection.c_delete_byUserAndPost(
					req.user_decoded.user_id,
					req.body.post_id
				)
				
				res.send(pFObj)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/posts/unfollow',
					message: 'Invalid post _id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/posts/unfollow',
				message: `Error --> ${err}`
			})
		}
	},
)


module.exports = router