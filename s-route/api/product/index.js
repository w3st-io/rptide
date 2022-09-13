// [REQUIRE]
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal
const { create, deleteOne, find } = require('./.handler.js')
const Auth = require('../../../s-middlewares/Auth')
const ApiSubscription = require('../../../s-middlewares/ApiSubscription')


// [EXPRESS + USE]
const router = express.Router().use(cors())


// [INIT]
const location = '/api/product'


router.post(
	'/create',
	Auth.userToken(),
	ApiSubscription.productLimitCheck(),
	async (req, res) => {
		res.send(await create({ req }));
	}
);


router.post(
	'/find',
	Auth.userToken(),
	async (req, res) => {
		res.send(await find({ req }));
	}
);


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
	'/delete-one',
	Auth.userToken(),
	async (req, res) => {
		res.send(await deleteOne({ req }));
	}
);


module.exports = router;