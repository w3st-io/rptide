// [IMPORT]
import mongoose from 'mongoose';


// [VALIDATE]
function validate({ requiredProductOptions, optionalProductOptions, subCategories, images }) {
	if (requiredProductOptions.length > 100) {
		return {
			status: false,
			message: 'Error: too many product options'
		};
	}

	if (optionalProductOptions.length > 100) {
		return {
			status: false,
			message: 'Error: too many product options'
		};
	}

	if (subCategories.length > 100) {
		return {
			status: false,
			message: 'Error: too many subCategories'
		};
	}

	if (images.length > 5) {
		return {
			status: false,
			message: 'Error: Too many images'
		};
	}

	for (let i = 0; i < requiredProductOptions.length; i++) {
		const pa = requiredProductOptions[i]
		
		if (!mongoose.isValidObjectId(pa)) {
			return {
				status: false,
				message: `Invalid product.productOption[${i}]`
			};
		}
	}

	for (let i = 0; i < optionalProductOptions.length; i++) {
		const pa = optionalProductOptions[i]
		
		if (!mongoose.isValidObjectId(pa)) {
			return {
				status: false,
				message: `Invalid product.productOption[${i}]`
			};
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
	images: [String],
	totalInStock: {
		type: Number,
		default: 1,
	},
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
	
	category: {
		type: String,
		default: '',
		maxlength: 50,
	},
	
	subCategories: [
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
		requiredProductOptions: this.requiredProductOptions,
		optionalProductOptions: this.optionalProductOptions,
		subCategories: this.subCategories,
		images: this.images
	});

	if (status.status == false) {
		throw `${status.message}`;
	}

	next();
})


ProductSchema.pre('updateOne', function (this: any, next: any) {
	const status = validate({
		requiredProductOptions: this._update.$set.requiredProductOptions,
		optionalProductOptions: this._update.$set.optionalProductOptions,
		subCategories: this._update.$set.subCategories,
		images: this._update.$set.images
	});

	if (status.status == false) {
		throw `${status.message}`;
	}

	next();
});


ProductSchema.pre('findOneAndUpdate', function (this: any, next: any) {
	const status = validate({
		requiredProductOptions: this._update.$set.requiredProductOptions,
		optionalProductOptions: this._update.$set.optionalProductOptions,
		subCategories: this._update.$set.subCategories,
		images: this._update.$set.images
	});

	if (status.status == false) {
		throw `${status.message}`;
	}
	
	next();
});


export default mongoose.model<IProduct>('Product', ProductSchema);