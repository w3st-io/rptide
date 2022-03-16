// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')



// [REQUIRE] Personal //
const rateLimiter = require('../../../s-rate-limiters')
const ActivityCollection = require('../../../s-collections/ActivityCollection')
const PostCollection = require('../../../s-collections/PostCollection')
const CommentCollection = require('../../../s-collections/CommentCollection')
const CommentLikeCollection = require('../../../s-collections/CommentLikeCollection')
const CommentReportCollection = require('../../../s-collections/CommentReportCollection')
const PostFollowCollection = require('../../../s-collections/PostFollowCollection')
const preeditedCommentCollection = require('../../../s-collections/PreeditedCommentCollection')
const NotificationCollection = require('../../../s-collections/NotificationCollection')
const Auth = require('../../../s-middlewares/Auth')
const socketService = require('../../../s-socket/socketService')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [CREATE] Auth Required //
router.post(
	'/create',
	Auth.userToken(),
	rateLimiter.comment,
	async (req, res) => {
		try {
			// [INIT] //
			const io = req.app.get('socketio')

			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				req.body.cleanJSON &&
				(req.body.replyToComment_id || req.body.replyToComment_id === null)
			) {
				// [READ][Post] //
				const pObj = await PostCollection.c_read(
					req.user_decoded.user_id,
					req.body.post_id
				)
				
				if (pObj.post) {
					// [CREATE][Comment] //
					const cObj = await CommentCollection.c_create({
						user_id: req.user_decoded.user_id,
						post_id: req.body.post_id,
						cleanJSON: req.body.cleanJSON,
						replyToComment: req.body.replyToComment_id,
					})

					if (cObj.status) {
						// [COUNT][Comments] //
						const cCObj = await CommentCollection.c_count_byPost(
							req.body.post_id
						)

						// [READ-ALL][PostFollow] //
						const pFObj = await PostFollowCollection.c_readAll_byPost(
							req.body.post_id
						)

						// [NOTIFCATION] Post Followers //
						for (let i = 0; i < pFObj.postFollows.length; i++) {
							if (pFObj.postFollows[i].user != req.user_decoded.user_id) {
								// [CREATE][Notification] Comment //
								await NotificationCollection.c_create(
									pFObj.postFollows[i].user,
									cObj.comment._id,
									'comment'
								)

								// [SOCKET-READ] Get userSocket by user_id //
								const userSocket = socketService.getSocketUserByUser_id(
									pFObj.postFollows[i].user
								)
								
								if (userSocket) {
									// [EMIT] //
									io.to(userSocket.socket_id).emit(
										'update-notification'
									)
								}
							}
						}

						// [NOTIFICATION] If Reply to Comment //
						if (cObj.comment.replyToComment) {
							// [READ] Comment //
							const repliedToComment = await CommentCollection.c_read({
								user_id: req.user_decoded.user_id,
								comment_id: cObj.comment.replyToComment,
							})

							// [CREATE][Notification] Reply //
							await NotificationCollection.c_create(
								repliedToComment.comment.user._id,
								cObj.comment._id,
								'reply'
							)

							// [SOCKET-READ] Get userSocket by user_id //
							const userSocket = socketService.getSocketUserByUser_id(
								repliedToComment.comment.user._id
							)
							
							if (userSocket) {
								// [EMIT] //
								io.to(userSocket.socket_id).emit(
									'update-notification'
								)
							}
						}

						// [CREATE][Activity] comment //
						await ActivityCollection.c_create({
							user_id: req.user_decoded.user_id,
							type: 'comment',
							post_id: cObj.comment.post,
							createdUser_id: undefined,
							createdPost_id: undefined,
							createdComment_id: cObj.comment._id
						})

						res.send({
							executed: true,
							status: true,
							comment: cObj.comment,
							cCObj: cCObj.count,
						})
					}
					else { res.send(cObj) }
				}
				else { res.send(pObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/comments/create',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/comments/create',
				message: `Error --> ${err}`,
			})
		}
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.comment_id) && req.body.cleanJSON) {
				// [OWNERSHIP] //
				const ownership = await CommentCollection.c_ownership(
					req.body.comment_id,
					req.user_decoded.user_id
				)

				if (ownership.status && ownership.ownership) {
					// [CREATE][PreeditedComment] //
					const preeditedComment = await preeditedCommentCollection.c_create(
						req.user_decoded.user_id,
						req.body.comment_id
					)

					if (preeditedComment.status) {
						// [UPDATE][Comment] //
						const updatedComment = await CommentCollection.c_update({
							comment_id: req.body.comment_id,
							user_id: req.user_decoded.user_id,
							cleanJSON: req.body.cleanJSON,
						})
						
						res.send(updatedComment)
					}
					else { res.send(preeditedComment) }
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: ownership.message,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/comments/update',
					message: '/api/user/comments/update: Invalid params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/comments/update',
				message: `/api/user/comments/update: Error --> ${err}`,
			})
		}
	},
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:comment_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			res.sendStatus(200)
			/*
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.comment_id)) {
				// [DELETE] //
				const comment = await CommentCollection.c_delete_byIdAndUser({
					comment_id: req.params.comment_id,
					user_id: req.user_decoded.user_id,
				})
					
				if (comment.status) {
					// [DELETE] CommentLike //
					const commentLikes = await CommentLikeCollection.c_deleteAll_byComment(
						req.params.comment_id
					)

					// [DELETE] Notifications //
					const notifications = await NotificationCollection.c_deleteAll_byComment(
						req.params.comment_id
					)
					
					// [DELETE] Activity //
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
					message: '/api/user/comments/delete: Invalid comment_id'
				})
			}
			*/
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/comments/delete',
				message: `/api/user/comments/delete: Error --> ${err}`,
			})
		}
	},
)


/******************* [LIKE-SYSTEM] *******************/
// [LIKE] Auth Required //
router.post(
	'/like',
	Auth.userToken(),
	rateLimiter.like,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.comment_id) &&
				validator.isAscii(req.body.commentUser_id)
			) {
				// [EXISTANCE] commentLike //
				const existance = await CommentLikeCollection.c_existance({
					user_id: req.user_decoded.user_id,
					comment_id: req.body.comment_id,
				})

				if (!existance.existance) {
					// [CREATE][CommentLike] //
					const commentLike = await CommentLikeCollection.c_create({
						user_id: req.user_decoded.user_id,
						post_id: req.body.post_id,
						comment_id: req.body.comment_id,
						commentUser_id: req.body.commentUser_id
					})

					res.send(commentLike)
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: existance.message
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/comments/like',
					message: '/api/user/comments/like: Invalid params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/comments/like',
				message: `/api/user/comments/like: Error --> ${err}`,
			})
		}
	},
)


// [UNLIKE] Auth Required //
router.post(
	'/unlike',
	Auth.userToken(),
	rateLimiter.like,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.body.comment_id)) {
				// [DELETE][CommentLike] //
				const commentLike = await CommentLikeCollection.c_delete_byUserAndComment({
					user_id: req.user_decoded.user_id,
					comment_id: req.body.comment_id,
				})
				
				res.send(commentLike)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/comments/unlike',
					message: 'Invalid comment _id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/user/comments/unlike',
				message: `Caight Error --> ${err}`,
			})
		}
	},
)


/******************* [REPORTS] *******************/
// [CREATE] Report //
router.post(
	'/report',
	Auth.userToken(),
	rateLimiter.report,
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.body.post_id) &&
				validator.isAscii(req.body.comment_id) &&
				validator.isAscii(req.body.reportType)
			) {
				// [FORMAT] //
				req.body.reportType = req.body.reportType.toLowerCase()

				// [READ][Comment] //
				const commentObj = await CommentCollection.c_read({
					user_id: req.user_decoded.user_id,
					comment_id: req.body.comment_id
				})

				if (commentObj.status && commentObj.comment) {
					// [EXISTANCE] Do not double save //
					const existance = await CommentReportCollection.c_existance_byUserAndComment(
						req.user_decoded.user_id,
						commentObj.comment._id
					)

					if (existance.status && !existance.existance) {
						// [CREATE][CommentReport] //
						const commentReport = await CommentReportCollection.c_create(
							req.user_decoded.user_id,
							commentObj.comment,
							req.body.post_id,
							req.body.reportType
						)

						res.send(commentReport)
					}
					else {
						res.send({
							executed: true,
							status: false,
							message: existance.message,
							existance: existance.existance,
						})
					}
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/api/user/comments/report',
						message: 'Comment doesnt exist.'
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/user/comments/report',
					message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
					location: '/api/user/comments/report',
					message: `Error --> ${err}`,
			})
		}
	},
)


module.exports = router