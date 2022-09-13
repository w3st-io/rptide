// [REQUIRE]
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal
const { create, find } = require('./.handler.js')
const Auth = require('../../../s-middlewares/Auth')
const ApiSubscription = require('../../../s-middlewares/ApiSubscription')


// [EXPRESS + USE]
const router = express.Router().use(cors())


// [INIT]
const location = '/api/user/product'


router.post(
	'/create',
	Auth.userToken(),
	ApiSubscription.productLimitCheck(),
	async (req, res) => {
		res.send(await create({ req }));
	}
);


router.get(
	'/find',
	Auth.userToken(),
	async (req, res) => {
		res.send(await find({ req }));
	}
);


router.get(
	'/read-all/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.params.limit) &&
				validator.isAscii(req.params.page)
			) {
				// [INIT]
				const user_id = (req.user_decoded) ? req.user_decoded._id : undefined

				const productsObj = await ProductCollection.c_readAll_sorted({
					user_id: user_id,

				})

				res.send(productsObj)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `${location}/read-all`,
					message: 'Invalid params'
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



router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.name)) {
				// [COLLECTION][Product][UPDATE]
				const productObj = await ProductCollection.c_update({
					user_id: req.user_decoded._id,
					product: req.body,
				})

				if (productObj.status) {
					res.send(productObj)
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


router.post(
	'/delete',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (validator.isAscii(req.body.product_id)) {
				// [COLLECTION][Product][DELETE]
				const deleteProductObj = await ProductCollection.c_delete_byUserAndId({
					user_id: req.user_decoded._id,
					product_id: req.body.product_id,
				})

				if (deleteProductObj.status) {
					res.send({
						executed: true,
						status: true,
						deleted: true,
						deleteProductObj: deleteProductObj,
						message: 'Product Deleted'
					})
				}
				else { res.send(deleteProductObj) }
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


module.exports = router;