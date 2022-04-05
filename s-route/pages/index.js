// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const PostCollection = require('../../s-collections/PostCollection')
const config = require('../../s-config')
const Auth = require('../../s-middlewares/Auth')
const categories = require('../../s-defaults/categories')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		// Set Custom Home Status //
		let customHome = false
		if (config.app.customHome == 'true') { customHome = true }
		
		try {
			// [INIT] //
			const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
			
			// [CATEGORIES] //
			for (let i = 0; i < categories.length; i++) {
				const category = categories[i]

				// [CATS] //
				for (let ii = 0; ii < category.cats.length; ii++) {
					const cat = category.cats[ii]
					
					// [FILL][TOTAL-POSTS] //
					const { count: postCount } = await PostCollection.c_count_byCat(
						cat.cat_id
					)

					cat.totalPosts = postCount

					// [FILL][RECENT-POST] //
					const pObj = await PostCollection.c_readAll_sorted_byCat({
						user_id: user_id,
						limit: 1,
						skip: 0,
						sort: 0,
						cat_id: cat.cat_id,
					})

					cat.recentPost = pObj.posts[0]
				}
			}
			
			// [TOP-POSTS] //
			const topPObj = await PostCollection.c_readAll_sorted(user_id, 1, 5, 0)

			const topPosts = topPObj.posts
			
			res.send({
				executed: true,
				status: true,
				customHome: customHome,
				categories: categories,
				topPosts: topPosts,
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				customHome: customHome,
				location: '/pages/user',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router