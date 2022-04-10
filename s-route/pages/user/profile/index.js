// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const ActivityCollection = require('../../../../s-collections/ActivityCollection')
const CommentCollection = require('../../../../s-collections/CommentCollection')
const CommentLikeCollection = require('../../../../s-collections/CommentLikeCollection')
const PostCollection = require('../../../../s-collections/PostCollection')
const PostLikeCollection = require('../../../../s-collections/PostLikeCollection')
const UserCollection = require('../../../../s-collections/UserCollection')
const Auth = require('../../../../s-middlewares/Auth')
const timeUtil = require('../../../../s-utils/timeUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - user_decoded //
router.get(
	'/index',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const timeFrame = 60
			const timeInterval = 1

			let activityData = []

			const userObj = await UserCollection.c_read_select({
				user_id: req.user_decoded.user_id,
				select: '-password -api.publicKey'
			})
			
			if (userObj.status) {
				// [COUNT][Post] //
				const postCount = await PostCollection.c_count_byUser(
					req.user_decoded.user_id
				)

				// [COUNT][PostLike] //
				const pLCount = await PostLikeCollection.c_count_byPostUser(
					req.user_decoded.user_id
				)

				// [COUNT][Comment] //
				const commentCount = await CommentCollection.c_count_byUser(
					req.user_decoded.user_id
				)

				// [COUNT][CommentLike] //
				const cLCount = await CommentLikeCollection.c_countByCommentUser(
					req.user_decoded.user_id
				)

				// Activity Order //
				for (let i = timeFrame; i > 0; i = i - timeInterval) {
					// timePointA & timePointB //
					const timePointA = timeUtil.pastTimeByMinutes(i + timeInterval)
					const timePointB = timeUtil.pastTimeByMinutes(i)

					// [READ-ALL] timePointA < Activity < timePointB //
					const { count: activityCount } = await ActivityCollection.c_count_byUserTimeFrame(
						req.user_decoded.user_id,
						timePointA,
						timePointB
					)

					activityData.push({
						time: timePointB.toLocaleTimeString(),
						count: activityCount
					})
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
				})
			}
			else { res.send(userObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user/profile',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router