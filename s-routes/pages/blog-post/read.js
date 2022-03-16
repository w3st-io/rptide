// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const BlogPostCollection = require('../../../s-collections/BlogPostCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [INIT] //
const location = '/s-routes/pages/blog-post/read'


router.get(
	'/:blogPost_id',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined

			// [READ][BlogPost] //
			const bPObj = await BlogPostCollection.c_read(
				user_id,
				req.params.blogPost_id
			)

			res.send(bPObj)
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			})
		}
	}
)


module.exports = router