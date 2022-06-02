// [REQUIRE] //
const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')


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
}).plugin(
	mongooseFuzzySearching,
	{
		fields: [
			{
				name: 'title',
				minSize: 4,
				weight: 5,
			},
		]
	}
)


module.exports = mongoose.model('WebApp', WebApp)