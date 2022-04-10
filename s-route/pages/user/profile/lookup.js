// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const ActivityCollection = require('../../../../s-collections/ActivityCollection')
const CommentLikeCollection = require('../../../../s-collections/CommentLikeCollection')
const CommentReportCollection = require('../../../../s-collections/CommentReportCollection')
const CommentCollection = require('../../../../s-collections/CommentCollection')
const PostCollection = require('../../../../s-collections/PostCollection')
const PostLikeCollection = require('../../../../s-collections/PostLikeCollection')
const UserCollection = require('../../../../s-collections/UserCollection')
const Auth = require('../../../../s-middlewares/Auth')
const timeUtil = require('../../../../s-utils/timeUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Params //
router.get(
	'/:user_id',
	Auth.adminTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (mongoose.isValidObjectId(req.params.user_id)) {
				const timeFrame = 60
				const timeInterval = 1
				
				let activityData = []
				let adminData = undefined

				const userObj = await UserCollection.c_read_select({
					user_id: req.params.user_id,
					select: 'username profile_img bio createdAt'
				})

				if (userObj.status) {
					if (userObj.user) {
						// [COUNT][Post] //
						const postCount = await PostCollection.c_count_byUser(
							req.params.user_id
						)

						// [COUNT][postLike] //
						const pLCount = await PostLikeCollection.c_count_byPostUser(
							req.params.user_id
						)

						// [COUNT][Comment] //
						const commentCount = await CommentCollection.c_count_byUser(
							req.params.user_id
						)

						// [COUNT][CommentLike] //
						const cLCount = await CommentLikeCollection.c_countByCommentUser(
							req.params.user_id
						)

						// Activity Order //
						for (let i = timeFrame; i > 0; i = i - timeInterval) {
							// timePointA & timePointB //
							const timePointA = timeUtil.pastTimeByMinutes(i + timeInterval)
							const timePointB = timeUtil.pastTimeByMinutes(i)

							// [READ-ALL] timePointA < Activity < timePointB //
							const { count: activityCount } = await ActivityCollection.c_count_byUserTimeFrame(
								req.params.user_id,
								timePointA,
								timePointB
							)

							activityData.push({
								time: timePointB.toLocaleTimeString(),
								count: activityCount
							})
						}


						if (req.admin_decoded && req.admin_decoded.role == 'admin') {
							const commentReportCount = await CommentReportCollection.c_count_byReportedUser(
								req.params.user_id
							)

							const commentReportHandledCount = await CommentReportCollection.c_count_byReportedUserAndHandled(
								req.params.user_id
							)

							const commentReportUnhandledCount = await CommentReportCollection.c_count_byReportedUserAndUnhandled(
								req.params.user_id
							)

							adminData = {
								commentReportCount: commentReportCount.count,
								commentReportHandledCount: commentReportHandledCount.count,
								commentReportUnhandledCount: commentReportUnhandledCount.count
							}
						}

						res.send({
							executed: true,
							status: true,
							user: userObj.user,
							postCount: postCount.count,
							postLikeCount: pLCount.count,
							commentCount: commentCount.count,
							commentLikeCount: cLCount.count,
							activityData: activityData,
							adminData: adminData,
						})
					}
					else {
						res.send({
							executed: true,
							status: false,
							message: 'User not Found'
						})
					}
				}
				else { res.send(userObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: 'Invalid user_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user/profile/lookup',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router