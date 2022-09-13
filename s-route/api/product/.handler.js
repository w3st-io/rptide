// [REQUIRE]
const mongoose = require('mongoose');


// [REQUIRE] Personal
const ProductCollection = require('../../../s-collections/ProductCollection')
const ProductModel = require('../../../s-models/ProductModel');


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: '/api/product',
	message: ''
};


module.exports = {
	create: async ({ req }) => {
		try {
			if (
				!validator.isAscii(req.body.name) ||
				!validator.isAscii(req.body.price.dollars) ||
				!validator.isAscii(req.body.price.cents) ||
				(
					req.body.category !== '' &&
					!validator.isAscii(req.body.category)
				) ||
				(
					req.body.description !== '' &&
					!validator.isAscii(req.body.description)
				)
			) {
				return {
					...returnObj,
					message: 'Invalid Parameters'
				}
			}

			// [COLLECTION][Product][CREATE]
			const productObj = await ProductCollection.c_create({
				user_id: req.user_decoded._id,
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				category: req.body.category,
				images: req.body.images,
			})

			if (productObj.status) {
				return {
					...returnObj,
					status: true,
					productObj: productObj,
				}
			}
			else { return productObj; }
		}
		catch (err) {
			return {
				...returnObj,
				executed: false,
				message: err
			}
		}
	},

	find: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			message: 'Found product(s)',
			location: returnObj.location + '/create'
		};

		try {
			// [PRODUCT]
			const result = await ProductModel.find({
				webApp: req.body.webApp,
				user: req.user_decoded._id
			})
				.populate('requiredProductOptions')
				.populate('optionalProductOptions')
				.exec()

			return {
				..._returnObj,	
				status: true,
				status: true,
				products: result,
			}
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err
			};
		}
	},
}