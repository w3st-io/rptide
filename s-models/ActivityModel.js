// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATE] //
function validate({ activity }) {
	return { status: true }
}


const activity = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	blogPost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BlogPost',
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	},

	type: {
		type: String,
		required: true,
		enum: ['blogPost', 'comment', 'manager', 'post', 'sectionText', 'user'],
	},

	createdBlogPost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BlogPost',
	},

	createdComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
	},

	createdPost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
	},

	createdUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
})


activity.pre('validate', function (next) {
	const status = validate({ activity: this })

	if (status.status == false) { throw status.message }
	
	next()
})


activity.pre('updateOne', function (next) {
	const status = validate({ activity: this })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Activity', activity)