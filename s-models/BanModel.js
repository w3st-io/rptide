// [REQUIRE] //
const mongoose = require('mongoose')


// [VALIDATE] //
function validate({ ban }) {
	return { status: true }
}


const ban = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	
	bannedTill: {
		type: Date,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
})


ban.pre('validate', function (next) {
	const status = validate()

	if (status.status == false) { throw status.message }
	
	next()
})


ban.pre('updateOne', function (next) {
	const status = validate()

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('Ban', ban)