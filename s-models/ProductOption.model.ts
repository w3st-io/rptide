// [IMPORT]
import mongoose from "mongoose";


// [INTERFACE]
export interface IProductOption extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	name: string,
	variants: [
		{
			name: string,
			images: [string],
			price: {
				number: number,
				inPennies: number,
				string: string,
				dollars: string,
				cents: string,
			},
			totalInStock: number,
		}
	],
	createdAt: Date,
};


export const ProductOptionSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	name: {
		type: String,
		required: true,
		maxlength: 100,
	},

	variants: [
		{
			name: {
				type: String,
				required: true,
			},

			images: [
				{
					type: String,
					maxlength: 500,
					default: '',
				},
			],

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

			totalInStock: {
				type: Number,
				default: 1,
			},
		}
	],

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


// [VALIDATE]
function validate(productOption: IProductOption) {
	// [LENGTH-CHECK] variants
	if (productOption.variants.length > 20) {
		return {
			status: false,
			message: 'Error: Too many variants'
		}
	}

	for (let i = 0; i < productOption.variants.length; i++) {
		// [LENGTH-CHECK] variants
		if (productOption.variants[i].images.length > 5) {
			return {
				status: false,
				message: `Error: Too many images for variants[${i}].images`
			}
		}
	}

	return { status: true }
}


ProductOptionSchema.pre('validate', function (this: any, next: any) {
	const status = validate(this)

	if (status.status == false) { throw `Error: ${status.message}` }
	
	next()
})


ProductOptionSchema.pre('updateOne', function (this: any, next: any) {
	const status = validate(this._update.$set)

	if (status.status == false) { throw `Error: ${status.message}` }
	
	next()
})


export default mongoose.model<IProductOption>('ProductOption', ProductOptionSchema);
