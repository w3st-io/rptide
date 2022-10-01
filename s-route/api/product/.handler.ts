// [IMPORT]
import mongoose from "mongoose";

// [IMPORT] Personal
import ProductModel from "../../../s-models/Product.model";
import formatterUtil from "../../../s-utils/formatterUtil";


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	location: "/api/product",
	message: ""
};


export default {
	create: async ({ req }: any) => {
		try {
			// [FORMAT]
			req.body.price.dollars = parseInt(req.body.price.dollars);
			req.body.price.cents = formatterUtil.centFormatter(req.body.price.cents);
			
			// Price
			const price_number = `${req.body.price.dollars}.${req.body.price.cents}`
			const price_inPennies = parseFloat(price_number) * 100;

			// [MONGODB][Product][SAVE]
			const createdProduct = await new ProductModel({
				_id: new mongoose.Types.ObjectId(),
				user: req.user_decoded._id,
				webApp: req.user_decoded.workspace.webApp,
				name: req.body.name,
				description: req.body.description,
				price: {
					number: price_number,
					inPennies: Math.floor(price_inPennies),
					string: price_number,
					dollars: req.body.price.dollars,
					cents: req.body.price.cents,
				},
				categories: req.body.categories || [],
				images: req.body.images || [],
			}).save();

			// [200] Success
			return {
				...returnObj,
				status: true,
				product: createdProduct
			};
		}
		catch (err) {
			return {
				...returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	deleteOne: async ({ req }: any) => {
		let _returnObj: any = {
			...returnObj,
			deleted: false,
			message: "Product Deleted"
		};

		try {
			// [MONGODB][Product][DELETE]
			const product = await ProductModel.deleteOne({
				user: req.user_decoded._id,
				_id: req.body.product_id,
			});

			return {
				..._returnObj,
				status: true,
				deleted: true,
				deleteProduct: product,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	find: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "Found product(s)",
			location: returnObj.location + "/create"
		};

		try {
			// [PRODUCT]
			const result = await ProductModel.find({
				webApp: req.body.webApp,
				user: req.user_decoded._id
			})
				.populate("requiredProductOptions")
				.populate("optionalProductOptions")
				.exec()
			;

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
				message: `${err}`
			};
		}
	},

	findOne: async ({ req }: any) => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "Found product",
			location: returnObj.location + "/create"
		};

		try {
			// [PRODUCT][findOne]
			const result = await ProductModel.findOne({
				_id: req.body.product_id,
				user: req.user_decoded._id
			})
				.populate("requiredProductOptions")
				.populate("optionalProductOptions")
				.exec()
			;

			// [200] Success
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
				message: `${err}`
			};
		}
	},

	update: async ({ req }: any) => {
		try {
			// [INIT][FORMAT]
			req.body.product.price.cents = formatterUtil.centFormatter(req.body.product.price.cents)

			const price_number = `${req.body.product.price.dollars}.${req.body.product.price.cents}`
			const price_inPennies = parseFloat(price_number) * 100;

			// [UPDATE]
			const updatedProduct = await ProductModel.findOneAndUpdate(
				{
					user: req.user_decoded._id,
					_id: req.body.product._id,
				},
				{
					$set: {
						name: req.body.product.name,
						description: req.body.product.description,
						price: {
							number: price_number,
							inPennies: Math.floor(price_inPennies),
							string: price_number,
							dollars: req.body.product.price.dollars,
							cents: req.body.product.price.cents,
						},
						categories: req.body.product.categories || [],
						images: req.body.product.images || [],
						requiredProductOptions: req.body.product.requiredProductOptions || [],
						optionalProductOptions: req.body.product.optionalProductOptions || [],
					}
				},
				{ new: true }
			)
				.populate({ path: "requiredProductOptions" })
				.populate({ path: "optionalProductOptions" })
				.exec()
			;
			
			// [200] Success
			return {
				...returnObj,
				status: true,
				updatedProduct: updatedProduct,
			};
		}
		catch (err) {
			return {
				...returnObj,
				executed: false,
				message: `${err}`
			};
		}
	}
}