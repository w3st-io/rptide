// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const PostCollection = require('../../../s-collections/PostCollection')
const categories = require('../../../s-defaults/categories')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/index/:cat_id/:sort/:limit/:page',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				validator.isAscii(req.params.cat_id) &&
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				// [READ-ALL] Sort //
				const pObj = await PostCollection.c_readAll_sorted_byCat({
					user_id: user_id,
					limit: limit,
					skip: skip,
					sort: sort,
					cat_id: req.params.cat_id,
				})

				if (pObj.status) {
					// [PINNED] (1st Page Only) //
					if (pageIndex == 0) {
						const { posts: pinnedPosts } = await PostCollection.c_readAll_sorted_byPinned(
							user_id,
							req.params.cat_id
						)

						// For Each Pinned Post Insert It At the Beginning of Array //
						pinnedPosts.forEach(p => { pObj.posts.unshift(p) })
					}

					// [COUNT] Posts //
					pObj.postsCount = (
						await PostCollection.c_count_byCat(req.params.cat_id)
					).count
					
					// [COUNT] Calculate Pages //
					pObj.totalPages = Math.ceil(pObj.postsCount / limit)
					
					res.send({
						executed: true,
						status: true,
						categories: categories,
						postsObj: pObj,
					})
				}
				else { res.send(pObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/cat',
					message: 'Invalid Params',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/cat',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router