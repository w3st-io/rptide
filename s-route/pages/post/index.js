// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const PostCollection = require('../../../s-collections/PostCollection')
const CommentCollection = require('../../../s-collections/CommentCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/index/:post_id/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.post_id) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				///// [READ][Post] ////
				const postObj = await PostCollection.c_read(
					user_id,
					req.params.post_id
				)

				if (postObj.status) {
					//// [READ-ALL][Comment] ////
					const commentsObj = await CommentCollection.c_readAll_byPost({
						user_id: user_id,
						post_id: req.params.post_id,
						limit: limit,
						skip: skip
					})

					if (commentsObj.status) {
						// [COUNT][Comment] //
						commentsObj.commentsCount = (
							await CommentCollection.c_count_byPost(req.params.post_id)
						).count

						// [COUNT] Calculate Total Pages //
						commentsObj.totalPages = Math.ceil(
							commentsObj.commentsCount / limit
						)
					}
				
					res.send({
						executed: true,
						status: true,
						postObj: postObj,
						commentsObj: commentsObj,
					})
				}
				else { res.send(postObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/post',
					message: 'Invalid params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/post',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router