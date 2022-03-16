// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const BlogPostCollection = require('../../s-collections/BlogPostCollection')
const Auth = require('../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [INIT] //
const location = '/public-api/products'


// [READ] //
router.post(
	'/read-all/:limit/:page',
	Auth.userTokenOrAPIPrivateKey(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.params.limit) &&
				validator.isAscii(req.params.page)
			) {
				// [INIT] //
				const user_id = (req.user_decoded) ? req.user_decoded.user_id : undefined
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				const productsObj = await BlogPostCollection.c_readAll_sorted_byUser({
					user_id: user_id,
					limit: limit,
					skip: skip
				})

				res.status(200).send(productsObj)
			}
			else {
				res.status(422).send({
					executed: true,
					status: false,
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.status(500).send({
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			})
		}
	}
)


module.exports = router