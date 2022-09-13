// [REQUIRE]
const mongoose = require('mongoose');
const validator = require('validator');


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
			// [COLLECTION][Product][CREATE]
			const productObj = await ProductCollection.c_create({
				user_id: req.user_decoded._id,
				webApp_id: req.user_decoded.workspace.webApp,
				name: req.body.name,
				description: req.body.description,
				price: req.body.price,
				category: req.body.category,
				images: req.body.images,
			});

			if (productObj.status) {
				return {
					...returnObj,
					status: true,
					productObj: productObj,
				};
			}
			else { return productObj; }
		}
		catch (err) {
			return {
				...returnObj,
				executed: false,
				message: err
			};
		}
	},

	deleteOne: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			deleted: false,
			message: 'Product Deleted'
		};

		try {
			if (!validator.isAscii(req.body.product_id)) {
				return {
					..._returnObj,
					message: 'Invalid Parameters'
				};
			}

			// [COLLECTION][Product][DELETE]
			const deleteProductObj = await ProductCollection.c_delete_byUserAndId({
				user_id: req.user_decoded._id,
				product_id: req.body.product_id,
			})

			if (!deleteProductObj.status) {
				return deleteProductObj;
			}

			return {
				..._returnObj,
				status: true,
				deleted: true,
				deleteProductObj: deleteProductObj,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err
			};
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

	findOne: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			message: 'Found product',
			location: returnObj.location + '/create'
		};

		try {
			// [PRODUCT][findOne]
			const result = await ProductModel.findOne({
				_id: req.body.product_id,
				user: req.user_decoded._id
			})
				.populate('requiredProductOptions')
				.populate('optionalProductOptions')
			.exec()

			return {
				..._returnObj,
				status: true,
				product: result,
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

	update: async ({ req }) => {
		try {
			// [COLLECTION][Product][UPDATE]
			const productObj = await ProductCollection.c_update({
				user_id: req.user_decoded._id,
				product: req.body,
			});

			return productObj;
		}
		catch (err) {
			return {
				...returnObj,
				executed: false,
				message: err
			};
		}
	}
}