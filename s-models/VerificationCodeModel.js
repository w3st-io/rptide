// [REQUIRE]
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'VerificationCode',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
	
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	
		verificationCode: {
			type: String,
			required: [true, 'This is required'],
			maxlength: 50,
		},

		createdAt: {
			type: Date,
			default: Date.now,
		},
	})
)