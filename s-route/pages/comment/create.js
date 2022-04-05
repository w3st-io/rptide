// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const PostCollection = require('../../../s-collections/PostCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/:post_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.post_id)) {
				// [READ][Post] //
				const postObj = await PostCollection.c_read(
					req.user_decoded.user_id,
					req.params.post_id
				)

				res.send(postObj)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/comment/create',
					message: 'Invalid post_id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/comment/create',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router