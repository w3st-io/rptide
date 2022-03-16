// [REQUIRE] //
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'Notification',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		
		// User to be Notified.. //
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		
		type: {
			type: String,
			required: true,
			enum: ['comment', 'reply'],
			maxlength: 15,
		},

		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			required: true,
		},
	
		read: {
			type: Boolean,
			default: false,
		},
	
		createdAt: {
			type: Date,
			default: Date.now,
		},
	})
)