// [REQUIRE]
const mongoose = require('mongoose')


// [VALIDATE]
function validate({ product }) {
	// [LENGTH-CHECK] variants
	if (product.variants.length > 20) {
		return {
			status: false,
			message: 'Error: too many variants'
		}
	}

	for (let i = 0; i < product.variants.length; i++) {
		const p = product.variants[i]

		// [LENGTH-CHECK] variants
		if (p.images.length > 5) {
			return {
				status: false,
				message: `Error: Too many images for variants[${i}].images`
			}
		}
	}

	return { status: true }
}


const productOption = mongoose.Schema({
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
})


productOption.pre('validate', function (next) {
	const status = validate({ product: this })

	if (status.status == false) { throw status.message }
	
	next()
})


productOption.pre('updateOne', function (next) {
	const status = validate({ product: this._update.$set })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('ProductOption', productOption)