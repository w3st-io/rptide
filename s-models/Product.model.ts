// [IMPORT]
import mongoose from 'mongoose';
import validator from "validator";


// [VALIDATE]
function validate({
	name,
	requiredProductOptions,
	optionalProductOptions,
	categories,
	description,
	images
}) {
	// [VALIDATE] req.body.name
	if (!validator.isAscii(name)) {
		return {
			status: false,
			message: "Invalid name"
		}
	}

	if (requiredProductOptions.length > 100) {
		return {
			status: false,
			message: 'Error: too many product options'
		};
	}

	for (let i = 0; i < requiredProductOptions.length; i++) {
		const pa = requiredProductOptions[i];
		
		if (!mongoose.isValidObjectId(pa)) {
			return {
				status: false,
				message: `Invalid product.productOption[${i}]`
			};
		}
	}

	if (optionalProductOptions.length > 100) {
		return {
			status: false,
			message: 'Error: too many product options'
		};
	}

	for (let i = 0; i < optionalProductOptions.length; i++) {
		const pa = optionalProductOptions[i];
		
		if (!mongoose.isValidObjectId(pa)) {
			return {
				status: false,
				message: `Invalid product.productOption[${i}]`
			};
		}
	}

	if (categories.length > 100) {
		return {
			status: false,
			message: 'Error: too many categories'
		};
	}

	if (images.length > 5) {
		return {
			status: false,
			message: 'Error: Too many images'
		};
	}

	for (let i = 0; i < images.length; i++) {
		const img = images[i];
		
		if (!validator.isURL(img)) {
			return {
				status: false,
				message: `Invalid images[${i}]`
			}
		}
	}

	return {
		status: true
	};
}


export interface IProduct extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	webApp: mongoose.Schema.Types.ObjectId,
	name: String,
	description: String,
	isSubscription: Boolean,
	price: {
		number: Number,
		inPennies: Number,
		string: String,
		dollars: String,
		cents: String,
	},
	category: String,
	subCategories: [String],
	categories: [String],
	images: [String],
	totalInStock: Number,
	requiredProductOptions: [mongoose.Schema.Types.ObjectId],
	optionalProductOptions: [mongoose.Schema.Types.ObjectId],
	createdAt: Date,
};

export const ProductSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	webApp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'WebApp',
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
		description: '',
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
			default: '',
		},
	],

	totalInStock: {
		type: Number,
		default: 1,
	},

	requiredProductOptions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductOption',
			required: true,
		}
	],

	optionalProductOptions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ProductOption',
			required: true,
		}
	],

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


ProductSchema.pre('validate', function (this: any, next: any) {
	const status = validate({
		name: this.name,
		requiredProductOptions: this.requiredProductOptions,
		optionalProductOptions: this.optionalProductOptions,
		categories: this.categories,
		description: this.description,
		images: this.images
	});

	if (status.status == false) {
		throw `${status.message}`;
	}

	next();
})


ProductSchema.pre('updateOne', function (this: any, next: any) {
	const status = validate({
		name: this._update.$set.name,
		requiredProductOptions: this._update.$set.requiredProductOptions,
		optionalProductOptions: this._update.$set.optionalProductOptions,
		categories: this._update.$set.categories,
		description: this._update.$set.description,
		images: this._update.$set.images
	});

	if (status.status == false) {
		throw `${status.message}`;
	}

	next();
});


ProductSchema.pre('findOneAndUpdate', function (this: any, next: any) {
	const status = validate({
		name: this._update.$set.name,
		requiredProductOptions: this._update.$set.requiredProductOptions,
		optionalProductOptions: this._update.$set.optionalProductOptions,
		categories: this._update.$set.categories,
		description: this._update.$set.description,
		images: this._update.$set.images
	});

	if (status.status == false) {
		throw `${status.message}`;
	}
	
	next();
});


export default mongoose.model<IProduct>('Product', ProductSchema);