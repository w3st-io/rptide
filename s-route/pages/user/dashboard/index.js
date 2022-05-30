// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const ProductOptionCollection = require('../../../../s-collections/ProductOptionCollection')
const ProductCollection = require('../../../../s-collections/ProductCollection')
const UserCollection = require('../../../../s-collections/UserCollection')
const config_const = require('../../../../s-config/const')
const h_apiSubscription = require('../../../api/user/api-subscription.handler')
const Auth = require('../../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [CONST] //
const location = '/pages/dashboard/index'


// [SEARCH] //
router.get(
	'/index/:tab/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.params.tab) &&
				validator.isAscii(req.params.sort) &&
				validator.isAscii(req.params.page) &&
				validator.isAscii(req.params.limit)
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				const apiSubscriptionTier = await h_apiSubscription.getSubscriptionTier({
					user_id: req.user_decoded.user_id,
				})

				switch (req.params.tab) {
					case 'web-app':
						res.send({
							executed: true,
							status: true,
							location: location,
						})
					break

					case 'api':
						res.send({
							executed: true,
							status: true,
							location: location,
						})
					break

					case 'web-content':
						res.send({
							executed: true,
							status: true,
						})
					break

					case 'product':
						const productsObj = await ProductCollection.c_readAll_sorted_byUser({
							user_id: req.user_decoded.user_id,
						})

						productsObj.limit = config_const.limit
						productsObj.apiSubscriptionTier = apiSubscriptionTier

						res.send(productsObj)
					break

					case 'product-options':
						const productOptionssObj = await ProductOptionCollection.c_readAll_sorted_byUser({
							user_id: req.user_decoded.user_id,
							
						})

						productOptionssObj.limit = config_const.limit
						productOptionssObj.apiSubscriptionTier = apiSubscriptionTier

						res.send(productOptionssObj)
					break

					
					default:
						res.send({
							executed: true,
							status: false,
							location: location,
							message: 'Invalid tab'
						})
					break
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router