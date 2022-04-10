// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const PostCollection = require('../../../s-collections/PostCollection')
const PostFollowCollection = require('../../../s-collections/PostFollowCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] //
router.get(
	'/:sort/:limit/:page',
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
				let posts = []

				// [COUNT][PostFollow] //
				const totalFollows = (
					await PostFollowCollection.c_countAllUser(req.user_decoded.user_id)
				).count

				// [CALCULATE] totalPages //
				const totalPages = Math.ceil(totalFollows / limit)
				
				// [READ-ALL][PostFollow] for user //
				const pFObj = await PostFollowCollection.c_readAll_sorted_byUser(
					req.user_decoded.user_id,
					sort,
					limit,
					skip
				)

				for (let i = 0; i < pFObj.postFollows.length; i++) {
					const postObj = await PostCollection.c_read(
						req.user_decoded.user_id,
						pFObj.postFollows[i].post
					)
					
					if (postObj.status) { posts.push(postObj.post) }
					else { res.send(postObj) }
				}

				res.send({
					executed: true,
					status: true,
					posts: posts,
					totalFollows: totalFollows,
					totalPages: totalPages,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/cat',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/followed',
				message: `Error --> ${err}`,
			})
		}
	},
)
	
	
module.exports = router