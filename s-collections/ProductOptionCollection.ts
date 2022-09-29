// [REQUIRE]
import mongoose from "mongoose"
import validator from "validator"


// [REQUIRE] Personal
const ProductOptionModel = require('../s-models/ProductOptionModel')
const formatterUtil = require('../s-utils/formatterUtil')


// [INIT]
const location = 'ProductOptionCollection'


module.exports = {
	/******************* [CRUD] *******************/
	c_create: async ({ user_id, productOption }) => {
		try {
			// [VALIDATE] user_id
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			// [VALIDATE] name
			if (!validator.isAscii(productOption.name)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid P.A. Name'
				}
			}

			// [VALIDATE] cents & dollars
			for (let i = 0; i < productOption.variants.length; i++) {
				const v = productOption.variants[i]

				if (!validator.isAscii(v.name)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: 'Invalid Name'
					}
				}
				
				if (
					!validator.isAscii(v.cents) ||
					isNaN(v.cents) ||
					v.cents.length > 2
				) {
					return {
						executed: true,
						status: false,
						location: location,
						message: 'Invalid Cents Amount'
					}
				}

				if (!validator.isAscii(v.dollars) || isNaN(v.dollars)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: 'Invalid Dollars Amount'
					}
				}
			}

			// [INIT]
			let variants = []

			for (let i = 0; i < productOption.variants.length; i++) {
				const v = productOption.variants[i]

				v.cents = formatterUtil.centFormatter(v.cents)

				variants.push(
					{
						name: v.name,
						images: [],
						price: {
							number: parseFloat(`${v.dollars}.${v.cents}`),
							inPennies: Math.floor(
								parseFloat(`${v.dollars}.${v.cents}`) * 100
							),
							string: `${v.dollars}.${v.cents}`,
							dollars: v.dollars,
							cents: v.cents,
						}
					}
				)
			}

			const createdProductOption = await new ProductOptionModel({
				_id: new mongoose.Types.ObjectId(),
				user: user_id,
				name: productOption.name,
				variants: variants,
			}).save()

			return {
				executed: true,
				status: true,
				location: location,
				productOption: createdProductOption
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
};