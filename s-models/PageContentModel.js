// [REQUIRE] //
const mongoose = require('mongoose')


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


const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	webApp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'WebApp',
		required: true,
	},

	page: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Page',
	},

	PageContent_responseTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PageContent',
	},

	tags: [
		{
			type: String,
			maxlength: 300,
		}
	],

	name: {
		type: String,
		default: '',
	},

	likeCount: {
		type: Number,
		default: 0
	},
	
	liked: {
		type: Boolean,
		default: false
	},

	cleanJSON: {
		time: {
			type: Number,
			default: Date.now,
		},

		blocks: [
			{
				id: {
					type: String,
					default: '',
				},

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

					file: {
						url: {
							type: String,
							default: '',
						}
					},

					height: {
						type: Number,
						maxlength: 5,
					},

					html: {
						type: String,
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

					withBackground: {
						type: Boolean,
					},


					withBorder: {
						type: Boolean,
					},

					withHeadings: {
						type: Boolean,
					},

				},
			}
		],
		
		version: {
			type: String,
			maxlength: 15
		}
	},

	createdTimeStamp: {
		type: Date,
		default: Date.now,
	},
})


schema.pre('validate', function (next) {
	const status = validate({ cleanJSON: this.cleanJSON })

	if (status.status == false) { throw status.message }
	
	next()
})


schema.pre('updateOne', function (next) {
	const status = validate({ cleanJSON: this._update.$set.cleanJSON })

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('PageContent', schema)