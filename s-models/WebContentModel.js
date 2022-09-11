// [REQUIRE]
const e = require('express')
const mongoose = require('mongoose')


// [VALIDATE]
function validate({ cleanJSON, tags = [] }) {
	// [LENGTH-CHECK] cleanJSON.blocks
	if (cleanJSON.blocks.length > 20) {
		return {
			status: false,
			message: 'Too many blocks'
		}
	}
	
	// [FOR-EACH] cleanJSON.blocks
	for (let i = 0; i < cleanJSON.blocks.length; i++) {
		const block = cleanJSON.blocks[i]
		
		// [LENGTH-CHECK] List Items
		if (block.data.items.length > 20) {
			return {
				status: false,
				message: 'Too many list-items'
			}
		}
		
		// content
		if (block.data.content.length > 0) {
			// [LENGTH-CHECK] Table ROW //
			if (block.data.content.length > 20) {
				return {
					status: false,
					message: 'Too many rows'
				}
			}

			// [LENGTH-CHECK] Table COLUMN //		
			for (let ii = 0; ii < block.data.content.length; ii++) {
				const col = block.data.content[ii]

				if (col.length > 20) {
					return {
						status: false,
						message: 'Too many columns'
					}
				}
			}
		}

		// items
		if (block.data.items) {
			// [LENGTH-CHECK]
			if (block.data.items.length > 20) {
				return {
					status: false,
					message: 'Too many items'
				}
			}
		}
	}

	// [LENGTH-CHECK] cleanJSON.blocks
	if (tags.length > 20) {
		return {
			status: false,
			message: 'Too many tags'
		}
	}

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

	name: {
		type: String,
		default: '',
		maxlength: 3000,
	},

	connectedWalletRequired: {
		type: Boolean,
		default: false
	},

	WebContent_responseTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'WebContent',
	},

	tags: [
		{
			type: String,
			maxlength: 300,
		}
	],

	likeCount: {
		type: Number,
		default: 0
	},
	
	liked: {
		type: Boolean,
		default: false
	},

	visible: {
		type: Boolean,
		default: false,
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
					maxlength: 3000,
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
						'raw',
						'simpleimage',
						'table'
					],
					maxlength: 3000,
				},
			
				data: {
					alignment: {
						type: String,
						enum: ['center', 'left'],
						maxlength: 3000,
					},

					caption: {
						type: String,
						maxlength: 3000,
					},

					code: {
						type: String,
						maxlength: 3000,
					},

					content: [
						[
							{
								type: String,
								maxlength: 300,
							}
						]
					],

					embed: {
						type: String,
						maxlength: 3000,
					},

					file: {
						url: {
							type: String,
							default: '',
							maxlength: 3000,
						}
					},

					height: {
						type: Number,
						maxlength: 3000,
					},

					html: {
						type: String,
						maxlength: 3000,
					},

					items: [
						{
							type: String,
							maxlength: 300,
						}
					],

					level: {
						type: Number,
						enum: [1, 2, 3, 4, 5, 6],
					},

					link: {
						type: String,
						maxlength: 3000,
					},

					meta: {
						title: {
							type: String,
							maxlength: 3000,
						},

						site_name: {
							type: String,
							maxlength: 3000,
						},

						description: {
							type: String,
							maxlength: 3000,
						},

						image: {
							url: {
								type: String,
								maxlength: 3000,
							},
						}
					},

					service: {
						type: String,
						maxlength: 3000,
					},

					style: {
						type: String,
						enum: ['ordered', 'unordered'],
						maxlength: 3000,
					},
					
					stretched: {
						type: Boolean
					},

					success: {
						type: Number,
						enum: [0, 1],
						maxlength: 3000,
					},

					text: {
						type: String,
						maxlength: 3000,
					},

					url: {
						type: String,
						maxlength: 3000,

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
			maxlength: 3000,
		}
	},

	createdTimeStamp: {
		type: Date,
		default: Date.now,
	},
})


schema.pre('save', function (next) {
	const status = validate({
		cleanJSON: this.cleanJSON,
		tags: this.tags,
	})

	if (status.status == false) { throw `Error: ${status.message}` }
	
	next()
})

schema.pre('validate', function (next) {
	const status = validate({
		cleanJSON: this.cleanJSON,
		tags: this.tags,
	})

	if (status.status == false) { throw `Error: ${status.message}` }
	
	next()
})


schema.pre('updateOne', function (next) {
	const status = validate({
		cleanJSON: this._update.$set.cleanJSON,
		tags: this._update.$set.tags,
	})

	if (status.status == false) { throw `Error: ${status.message}` }
	
	next()
})


module.exports = mongoose.model('WebContent', schema)