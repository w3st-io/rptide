// [REQUIRE] //
const mongoose = require('mongoose')


module.exports = mongoose.model(
	'PostLike',
	mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: true,
		},

		postUser: {
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