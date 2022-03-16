// [REQUIRE] //
const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')


// [VALIDATE] //
function validate({ cleanJSON }) {
	// [LENGTH-CHECK] Blocks //
	if (cleanJSON.blocks.length > 20) {
		return {
			status: false,
			message: 'Error: Comment too large'
		}
	}
		
	cleanJSON.blocks.forEach((block) => {
		// [LENGTH-CHECK] List Items //
		if (block.data.items) {
			return {
				status: false,
				message: 'Error: Too many list-items'
			}
		}
		
		// [LENGTH-CHECK] Table ROW //
		if (block.data.content) {
			if (block.data.content.length > 20) {
				return {
					status: false,
					message: 'Error: Too many Rows'
				}
			}
		}

		// [LENGTH-CHECK] Table COLUMN //
		if (block.data.content) {
			block.data.content.forEach((col) => {
				if (col.length > 20) {
					return {
						status: false,
						message: 'Error: Too many Columns'
					}
				}
			})
		}
	})

	return { status: true }
}


const BlogPost = mongoose.Schema({
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

	commentCount: {
		type: Number,
		default: 0,
	},

	cleanJSON: {
		time: {
			type: Number,
			maxlength: 100,
		},

		blocks: [
			{
				type: {
					type: String,
					enum: [
						'code',
						'delimiter',
						'embed',
						'header',
						'image',
						'list',
						'paragraph',
						'quote',
						'table'
					],
				},
			
				data: {
					alignment: {
						type: String,
						enum: ['center', 'left']
					},

					caption: {
						type: String,
						maxlength: 1000,
					},

					code: {
						type: String,
						maxlength: 1000,
					},

					content: [
						[
							{
								type: String,
								maxlength: 50,
							}
						]
					],

					embed: {
						type: String,
						maxlength: 300,
					},

					height: {
						type: Number,
						maxlength: 5,
					},

					items: [
						{
							type: String,
							maxlength: 50,
						}
					],

					level: {
						type: Number,
						enum: [1, 2, 3, 4, 5, 6],
					},

					service: {
						type: String,
						maxlength: 200,
					},

					service: {
						type: String,
						maxlength: 50,
					},

					style: {
						type: String,
						enum: ['ordered', 'unordered']
					},

					text: {
						type: String,
						maxlength: 3000,
					},

					url: {
						type: String,
						maxlength: 300,
					},

					width: {
						type: Number,
						maxlength: 5,
					},
				},
			}
		],
		
		version: {
			type: String,
			maxlength: 15
		}
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


BlogPost.pre('validate', function (next) {
	const status = validate({ cleanJSON: this.cleanJSON })

	if (status.status == false) { throw status.message }
	
	next()
})


BlogPost.pre('updateOne', function (next) {
	const status = validate({ cleanJSON: this._update.$set.cleanJSON })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('BlogPost', BlogPost)