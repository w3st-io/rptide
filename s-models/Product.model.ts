// [IMPORT]
import mongoose from "mongoose";
import validator from "validator";


// [INTERFACE]
export interface IProduct extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	webApp: mongoose.Schema.Types.ObjectId,
	name: string,
	description: string,
	isSubscription: boolean,
	price: {
		number: number,
		inPennies: number,
		string: string,
		dollars: string,
		cents: string,
	},
	categories: [string],
	images: [string],
	totalInStock: number,
	requiredProductOptions: [mongoose.Schema.Types.ObjectId],
	optionalProductOptions: [mongoose.Schema.Types.ObjectId],
	createdAt: Date,
};


// [SCHEMA]
export const ProductSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	webApp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "WebApp",
		required: true,
	},

	name: {
		type: String,
		maxlength: 100,
		required: true,
	},

	description: {
		type: String,
		maxlength: 500,
		description: "",
	},

	isSubscription: {
		type: Boolean,
		default: false,
	},

	price: {
		number: {
			type: Number,
			required: true,
		},
		
		inPennies: {
			type: Number,
			required: true,
		},
		
		string: {
			type: String,
			required: true,
		},
		
		dollars: {
			type: String,
			required: true,
		},
	
		cents: {
			type: String,
			required: true,
		},
	},
	
	categories: [
		{
			type: String,
			required: true,
			maxlength: 50,
		}
	],

	images: [
		{
			type: String,
			maxlength: 500,
			default: "",
		},
	],

	totalInStock: {
		type: Number,
		default: 1,
	},

	requiredProductOptions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductOption",
			required: true,
		}
	],

	optionalProductOptions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductOption",
			required: true,
		}
	],

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


// [VALIDATE]
function validate(product: IProduct) {
	// [VALIDATE] product.name
	if (!validator.isAscii(product.name)) {
		return {
			status: false,
			message: "Invalid product.name"
		}
	}

	// [VALIDATE] product.description
	if (product.description) {
		if (!validator.isAscii(product.description)) {
			return {
				status: false,
				message: "Invalid product.description"
			};
		}
	}

	// [VALIDATE] product.price.dollars
	if (
		!validator.isAscii(product.price.dollars) ||
		product.price.dollars.length < 0
	) {
		return {
			status: false,
			message: "Invalid price.dollars"
		}
	}

	// [VALIDATE] product.price.cents
	if (
		!validator.isAscii(product.price.cents) ||
		product.price.cents.length < 0
	) {
		return {
			status: false,
			message: "Invalid price.cents"
		}
	}

	// [VALIDATE] product.categories
	if (product.categories) {
		if (product.categories.length > 100) {
			return {
				status: false,
				message: "Too many product.categories (Over 100)"
			};
		}

		for (let i = 0; i < product.categories.length; i++) {
			if (!validator.isAscii(product.categories[i])) {
				return {
					status: false,
					message: `Invalid product.categories[${i}]`
				}
			}
		}
	}
	
	// [VALIDATE] product.images
	if (product.images) {
		if (product.images.length > 50) {
			return {
				status: false,
				message: "Error: Too many product.images (Over 50)"
			};
		}
	
		for (let i = 0; i < product.images.length; i++) {
			if (!validator.isURL(product.images[i])) {
				return {
					status: false,
					message: `Invalid product.images[${i}]`
				}
			}
		}
	}

	// [VALIDATE] product.requiredProductOptions
	if (product.requiredProductOptions) {
		if (product.requiredProductOptions.length > 100) {
			return {
				status: false,
				message: "Too many product.requiredProductOptions (Over 100)"
			};
		}
	
		for (let i = 0; i < product.requiredProductOptions.length; i++) {
			if (!mongoose.isValidObjectId(product.requiredProductOptions[i])) {
				return {
					status: false,
					message: `Invalid product.requiredProductOptions[${i}]`
				};
			}
		}
	}

	// [VALIDATE] product.optionalProductOptions
	if (product.optionalProductOptions) {
		if (product.optionalProductOptions.length > 100) {
			return {
				status: false,
				message: "Too many product.optionalProductOptions (Over 100)"
			};
		}
	
		for (let i = 0; i < product.optionalProductOptions.length; i++) {
			if (!mongoose.isValidObjectId(product.optionalProductOptions[i])) {
				return {
					status: false,
					message: `Invalid product.optionalProductOptions[${i}]`
				};
			}
		}
	}

	// [200] Success
	return {
		status: true
	};
}


ProductSchema.pre("validate", function (this: any, next: any) {
	const status = validate(this);

	if (status.status == false) {
		throw `${status.message}`;
	}

	next();
})

ProductSchema.pre("findOneAndUpdate", function (this: any, next: any) {
	const status = validate(this._update.$set);

	if (status.status == false) {
		throw `${status.message}`;
	}
	
	next();
});


export default mongoose.model<IProduct>("Product", ProductSchema);