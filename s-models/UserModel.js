// [REQUIRE]
const mongoose = require('mongoose');


// [INIT]
const defaultImage = 'https://icon-library.com/images/placeholder-icon/placeholder-icon-17.jpg';


module.exports = mongoose.model(
	'User',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		role: {
			type: String,
			enum: ['admin', ''],
			default: '',
			maxlength: 10,
		},

		email: {	
			unique: true,
			type: String,
			required: [true, 'This is required'],
			maxlength: 50,
		},

		username: {
			type: String,
			default: '',
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

		workspace: {
			webApp: {
				type: String,
				default: '',
				maxlength: 50,
			},
		},

		createdAt: {
			type: Date,
			default: Date.now,
		},
	})
);