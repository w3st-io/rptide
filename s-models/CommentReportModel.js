// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATE] //
function validate({ commentReport }) {
	return { status: true }
}


const commentReport = mongoose.Schema({
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
		enum: ['innapropiate', 'offensive', 'scam', 'bot', 'spam', 'other'],
		maxlength: 14,
	},
	
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
		required: true,
	},
	
	comment: {
		type: Object,
		required: true,
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


commentReport.pre('validate', function (next) {
	const status = validate({ commentReport: this })

	if (status.status == false) { throw status.message }
	
	next()
})


commentReport.pre('updateOne', function (next) {
	const status = validate({ commentReport: this._update.$set })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('CommentReport', commentReport)