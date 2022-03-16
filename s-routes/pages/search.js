// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const PostCollection = require('../../s-collections/PostCollection')
const UserCollection = require('../../s-collections/UserCollection')
const Auth = require('../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [SEARCH] //
router.get(
	'/:query/:type/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.query) &&
				validator.isAscii(req.params.type) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [COUNT] Posts //
				const { count: postCount } = await PostCollection.c_fuzzySearchCount(
					req.params.query,
				)

				// [COUNT] Users //
				const { count: userCount } = await UserCollection.c_fuzzySearchCount(
					req.params.query
				)

				if (req.params.type == 'posts') {
					// [READ][Post] //
					const { posts } = await PostCollection.c_fuzzySearch(
						user_id,
						req.params.query,
						limit,
						skip,
					)

					// [CALCULATE] Total Pages //
					const totalPages = Math.ceil(postCount / limit)

					res.send({
						executed: true,
						status: true,
						postResults: posts,
						postCount: postCount,
						userCount: userCount,
						totalPages: totalPages,
					})

				}
				else if (req.params.type == 'users') {
					// [READ][User] //
					const { users } = await UserCollection.c_fuzzySearch(
						user_id,
						req.params.query,
						limit,
						skip,
					)

					// [CALCULATE] Total Pages //
					const totalPages = Math.ceil(userCount / limit)

					res.send({
						executed: true,
						status: true,
						userResults: users,
						postCount: postCount,
						userCount: userCount,
						totalPages: totalPages,
					})
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/pages/search',
						message: 'Invalid type',
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/search',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/search',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router