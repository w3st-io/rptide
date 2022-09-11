// [REQUIRE]
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal
const ProductCollection = require('../../../s-collections/ProductCollection')
const ProductOptionCollection = require('../../../s-collections/ProductOptionCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE]
const router = express.Router().use(cors())


// [SEARCH]
router.get(
	'/:product_id',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.params.product_id)) {
				// [INIT]
				const user_id = (req.user_decoded) ? req.user_decoded._id : undefined

				const productsObj = await ProductCollection.c_read({
					user_id: user_id,
					product_id: req.params.product_id
				})

				if (productsObj.status) {
					const productOptionsObj = await ProductOptionCollection.c_readAll_sorted_byUser({
						user_id: user_id,
					})

					if (productOptionsObj.status) {
						res.send({
							executed: true,
							status: true,
							product: productsObj.product,
							productOptions: productOptionsObj.productOptions
						})
					}
					else { res.send(productOptionsObj) }
				}
				else { res.send(productsObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					message: 'Invalid Params'
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