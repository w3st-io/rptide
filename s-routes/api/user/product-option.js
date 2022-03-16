// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const ProductOptionCollection = require('../../../s-collections/ProductOptionCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [INIT] //
const location = '/api/user/product-options'


/******************* [CRUD] *******************/
// [CREATE] //
router.post(
	'/create',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.name)) {
				// [COLLECTION][ProductOption][CREATE] //
				const productObj = await ProductOptionCollection.c_create({
					user_id: req.user_decoded.user_id,
					productOption: req.body
				})

				if (productObj.status) {
					res.send({
						executed: true,
						status: true,
						productObj: productObj,
					})
				}
				else { res.send(productObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid Parameters`
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/read-all/:limit/:page`,
				message: `${location}: Error --> ${err}`
			})
		}
	}
)


module.exports = router