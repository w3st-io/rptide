// [REQUIRE]
const mongoose = require('mongoose');


const WebApp = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	name: {
		type: String,
		required: true,
		maxlength: 200,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});


module.exports = mongoose.model('WebApp', WebApp);