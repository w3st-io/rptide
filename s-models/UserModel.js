// [REQUIRE] //
const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')


// [INIT] //
const defaultImage = 'https://icon-library.com/images/placeholder-icon/placeholder-icon-17.jpg'


module.exports = mongoose.model(
	'User',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		email: {	
			type: String,
			required: [true, 'This is required'],
			maxlength: 50,
		},

		username: {
			type: String,
			required: [true, 'This is required'],
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
		
		profile_img: {
			type: String,
			default: defaultImage,
			maxlength: 600,
		},
		
		password: {
			type: String,
			required: [true, 'This is required'],
		},

		bio: {
			type: String,
			default: '',
			maxlength: 600,
		},

		verified: {
			type: Boolean,
			default: false,
		},

		location: {
			type: String,
			default: '',
		},

		social: {
			friends: {
				type: Boolean,
				default: null,
			},
	
			blocked: {
				type: Boolean,
				default: null,
			},
		},
		
		api: {
			publicKey: {
				type: String,
				default: null,
				maxlength: 50,
			},
	
			privateKey: {
				type: String,
				default: null,
				maxlength: 50,
			},

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
)