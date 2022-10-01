// [IMPORT]
import mongoose, { FilterQuery } from "mongoose";

// [IMPORT] Personal
import ProductModel, { IProduct } from "../../../s-models/Product.model";
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
			// [INIT]
			let product = req.body.product;
			
			// [FORMAT]
			product.price.cents = formatterUtil.centFormatter(product.price.cents);
			
			// Price
			const price_number = `${product.price.dollars}.${product.price.cents}`
			const price_inPennies = parseFloat(price_number) * 100;

			// [MONGODB][Product][SAVE]
			const createdProduct = await new ProductModel({
				_id: new mongoose.Types.ObjectId(),
				user: req.user_decoded._id,
				webApp: req.user_decoded.workspace.webApp,
				name: product.name,
				description: product.description,
				price: {
					number: price_number,
					inPennies: Math.floor(price_inPennies),
					string: price_number,
					dollars: product.price.dollars,
					cents: product.price.cents,
				},
				categories: product.categories || [],
				images: product.images || [],
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
			const result = await ProductModel.find(
				{
					webApp: req.body.webApp,
					user: req.user_decoded._id
				} as FilterQuery<IProduct>
			)
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
			const result = await ProductModel.findOne(
				{
					_id: req.body.product_id,
					user: req.user_decoded._id
				} as FilterQuery<IProduct>
			)
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
			// [INIT]
			let product = req.body.product;

			// [INIT][FORMAT]
			product.price.cents = formatterUtil.centFormatter(product.price.cents);

			const price_number = `${product.price.dollars}.${product.price.cents}`;
			const price_inPennies = parseFloat(price_number) * 100;

			// [UPDATE]
			const updatedProduct = await ProductModel.findOneAndUpdate(
				{
					user: req.user_decoded._id,
					_id: product._id,
				} as FilterQuery<IProduct>,
				{
					$set: {
						name: product.name,
						description: product.description,
						price: {
							number: price_number,
							inPennies: Math.floor(price_inPennies),
							string: price_number,
							dollars: product.price.dollars,
							cents: product.price.cents,
						},
						categories: product.categories || [],
						images: product.images || [],
						requiredProductOptions: product.requiredProductOptions || [],
						optionalProductOptions: product.optionalProductOptions || [],
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