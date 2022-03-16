// [REQUIRE] //
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'UserReport',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		handled: {
			type: Boolean,
			default: false,
		},

		reportType: {
			type: String,
			required: true,
			enum: ['innapropiate', 'offensive', 'scammer', 'bot', 'other'],
			maxlength: 24,
		},
		
		
		reportedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		createdAt: {
			type: Date,
			default: Date.now,
		},
	})
)