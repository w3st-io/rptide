// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const ProductModel = require('../s-models/ProductModel')
const formatterUtil = require('../s-utils/formatterUtil')

// [INIT] //
const location = 'ProductCollection'


module.exports = {
	/******************* [CRUD] *******************/
	c_create: async ({
		user_id,
		name,
		description,
		price,
		category,
		subCategories = [],
		images = [],
		optionalProductOptions = [],
		requiredProductOptions = [],
	}) => {
		try {
			// [VALIDATE] user_id //
			if (!validator.isAscii(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid user_id`
				}
			}

			// [VALIDATE] name //
			if (!validator.isAscii(name)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid name`
				}
			}

			// [VALIDATE] description //
			if (description) {
				if (!validator.isAscii(description)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: `${location}: Invalid description`
					}
				}
			}
			
			// [VALIDATE] price.dollars //
			if (
				isNaN(price.dollars) ||
				!validator.isAscii(price.dollars) ||
				price.dollars.length < 0
			) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid price.dollars`
				}
			}

			// [VALIDATE] price.cents //
			if (
				isNaN(price.cents) ||
				!validator.isAscii(price.cents) ||
				price.cents.length <= 0
			) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid cents`
				}
			}

			// [VALIDATE] category //
			if (category) {
				if (!validator.isAscii(category)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: `${location}: Invalid category`
					}
				}
			}
			
			// [VALIDATE] subCategories //
			subCategories.forEach((subCategory, i) => {
				if (!validator.isAscii(subCategory)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: `${location}: Invalid subCategories[${i}]`
					}
				}
			})	

			// [VALIDATE] images //
			images.forEach((image, i) => {
				if (!validator.isURL(image)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: `${location}: Invalid images[${i}]`
					}
				}
			})

			// [VALIDATE] optionalProductOptions //
			for (let i = 0; i < optionalProductOptions.length; i++) {
				const pa = optionalProductOptions[i]
				
				if (!mongoose.isValidObjectId(pa)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: `${location}: Invalid optionalProductOptions[${i}]`
					}
				}
			}

			// [VALIDATE] requiredProductOptions //
			for (let i = 0; i < requiredProductOptions.length; i++) {
				const pa = requiredProductOptions[i]
				
				if (!mongoose.isValidObjectId(pa)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: `${location}: Invalid requiredProductOptions[${i}]`
					}
				}
			}

			// [FORMAT] //
			price.dollars = parseInt(price.dollars)
			price.cents = formatterUtil.centFormatter(price.cents)
			
			// Price //
			const price_number = `${price.dollars}.${price.cents}`
			const price_inPennies = parseFloat(price_number) * 100


			// [PRODUCT][SAVE] //
			const createdProduct = await new ProductModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				name: name,
				price: {
					number: price_number,
					inPennies: Math.floor(price_inPennies),
					string: price_number,
					dollars: price.dollars,
					cents: price.cents,
				},
				category: category,
				description: description,
				images: images,
			}).save()
	
			return {
				executed: true,
				status: true,
				location: location,
				createdProduct: createdProduct,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_read: async ({ user_id, product_id }) => {
		try {
			const product = await ProductModel.findOne({
				_id: product_id,
				user: user_id,
			})
				.populate({ path: 'requiredProductOptions' })
				.populate({ path: 'optionalProductOptions' })
				.exec()

			return {
				executed: true,
				status: true,
				product: product,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_readAll_sorted_byUser: async ({ user_id }) => {
		try {
			const products = await ProductModel.find({
				user: user_id
			})
				.populate('requiredProductOptions')
				.populate('optionalProductOptions')
				.exec()

			return {
				executed: true,
				status: true,
				products: products,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_update: async ({ user_id, product }) => {
		try {
			// [VALIDATE] product.requiredProductOptions //
			for (let i = 0; i < product.requiredProductOptions.length; i++) {
				const pa = product.requiredProductOptions[i]
				
				if (!mongoose.isValidObjectId(pa) || pa == null || pa == '') {
					return {
						executed: true,
						status: false,
						location: location,
						message: `Invalid product.productOption[${i}]`
					}
				}
			}

			// [VALIDATE] product.optionalProductOptions //
			for (let i = 0; i < product.optionalProductOptions.length; i++) {
				const pa = product.optionalProductOptions[i]
				
				if (!mongoose.isValidObjectId(pa) || pa == null || pa == '') {
					return {
						executed: true,
						status: false,
						location: location,
						message: `Invalid product.productOption[${i}]`
					}
				}
			}

			// [INIT][FORMAT] //
			product.price.dollars = parseInt(product.price.dollars)
			product.price.cents = formatterUtil.centFormatter(product.price.cents)

			const price_number = `${product.price.dollars}.${product.price.cents}`
			const price_inPennies = parseFloat(price_number) * 100

			// [UPDATE] //
			const updatedProduct = await ProductModel.findOneAndUpdate(
				{
					user: user_id,
					_id: product._id,
				},
				{
					$set: {
						name: product.name,
						description: product.description,
						category: product.category,
						name: product.name,
						price: {
							number: price_number,
							inPennies: Math.floor(price_inPennies),
							string: price_number,
							dollars: product.price.dollars,
							cents: product.price.cents,
						},
						requiredProductOptions: product.requiredProductOptions,
						optionalProductOptions: product.optionalProductOptions,
						subCategories: product.subCategories,
						images: product.images,
					}
				},
				{ new: true, }
			)
				.populate({ path: 'requiredProductOptions' })
				.populate({ path: 'optionalProductOptions' })
				.exec()
			
			return {
				executed: true,
				status: true,
				location: location,
				updatedProduct: updatedProduct,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_delete_byUserAndId: async ({ user_id, product_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid user_id`
				}
			}

			// [VALIDATE] product_id //
			if (!mongoose.isValidObjectId(product_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid product_id`
				}
			}

			const product = await ProductModel.deleteOne({
				user: user_id,
				_id: product_id
			})

			return {
				executed: true,
				status: true,
				product: product,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	/******************* [COUNT] *******************/
	c_count_byUser: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid user_id`,
					updated: false,
				}
			}
	
			const count = await ProductModel.countDocuments({ user: user_id })
	
			return {
				executed: true,
				status: true,
				count: count
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `postsCollection: Error --> ${err}`,
			}
		}
	},

}