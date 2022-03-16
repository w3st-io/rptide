// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const CommentCollection = require('../../../s-collections/CommentCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ] //
router.get(
	'/:comment_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.comment_id)) {
				// [READ][Comment] //
				const returned = await CommentCollection.c_read({
					user_id: req.user_decoded.user_id,
					comment_id: req.params.comment_id
				})
	
				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/comment/edit',
					message: 'Invalid comment _id',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/comment/edit',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router