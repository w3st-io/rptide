// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATE] //
function validate({ images }) {
	if (images.length > 5) {
		return {
			status: false,
			message: 'Error: Too many images'
		}
	}

	return { status: true }
}


const productAdd = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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

	createdAt: {
		type: Date,
		default: Date.now,
	},
})


productAdd.pre('validate', function (next) {
	const status = validate({
		requiredProductOptions: this.requiredProductOptions,
		optionalProductOptions: this.optionalProductOptions,
		subCategories: this.subCategories,
		images: this.images
	})

	if (status.status == false) { throw status.message }

	next()
})


productAdd.pre('updateOne', function (next) {
	const status = validate({ images: this._update.$set.images })

	if (status.status == false) { throw status.message }
	
	next()
})


productAdd.pre('findOneAndUpdate', function (next) {
	const status = validate({ images: this._update.$set.images })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Productadd', productAdd)