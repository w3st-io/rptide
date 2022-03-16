// [REQUIRE] //
const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')


const SectionText = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	title: {
		type: String,
		required: true,
		maxlength: 200,
	},

	sectionTexts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SectionText',
			required: true,
		}
	],

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


module.exports = mongoose.model('SectionText', SectionText)