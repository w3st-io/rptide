// [REQUIRE] //
const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')


// [VALIDATE] //
function validate() {
	return { status: true }
}


const admin = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	role: {
		type: String,
		enum: ['admin', 'not-admin'],
		default: 'not-admin',
		maxlength: 10,
	},

	email: {
		type: String,
		required: [true, 'Email is required'],
		maxlength: 50,
		lowercase: true
	},
	
	username: {
		type: String,
		required: [true, 'Username is required'],
		maxlength: 24,
	},
	
	first_name: {
		type: String,
		default: '',
		maxlength: 24,
	},
	
	last_name: {
		type: String,
		default: '',
		maxlength: 24,
	},
	
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	
	createdAt: {
		type: Date,
		default: Date.now,
	},
}).plugin(
	mongooseFuzzySearching,
	{
		fields: [
			{
				name: 'role',
				minSize: 4,
				weight: 5,
			},
			{
				name: 'email',
				minSize: 4,
				weight: 5,
			},
			{
				name: 'username',
				minSize: 4,
				weight: 5,
			},
			{
				name: 'first_name',
				minSize: 4,
				weight: 5,
			},
			{
				name: 'last_name',
				minSize: 4,
				weight: 5,
			},
		]
	}
)


admin.pre('validate', function (next) {
	const status = validate()

	if (status.status == false) { throw status.message }
	
	next()
})


admin.pre('updateOne', function (next) {
	const status = validate()

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Admin', admin)