// [REQUIRE]
import mongoose from "mongoose";


// [VALIDATE]
function validate({ cleanJSON, tags = [] }) {
	// [LENGTH-CHECK] cleanJSON.blocks
	if (cleanJSON.blocks.length > 50) {
		return {
			status: false,
			message: "Too many blocks"
		};
	}
	
	// [FOR-EACH] cleanJSON.blocks
	for (let i = 0; i < cleanJSON.blocks.length; i++) {
		const block = cleanJSON.blocks[i];
		
		// [LENGTH-CHECK] List Items
		if (block.data.items.length > 20) {
			return {
				status: false,
				message: "Too many list-items"
			};
		}
		
		// content
		if (block.data.content.length > 0) {
			// [LENGTH-CHECK] Table ROW //
			if (block.data.content.length > 20) {
				return {
					status: false,
					message: "Too many rows"
				};
			}

			// [LENGTH-CHECK] Table COLUMN //		
			for (let ii = 0; ii < block.data.content.length; ii++) {
				const col = block.data.content[ii];

				if (col.length > 20) {
					return {
						status: false,
						message: "Too many columns"
					};
				}
			}
		}

		// items
		if (block.data.items) {
			// [LENGTH-CHECK]
			if (block.data.items.length > 20) {
				return {
					status: false,
					message: "Too many items"
				};
			}
		}
	}

	// [LENGTH-CHECK] cleanJSON.blocks
	if (tags.length > 20) {
		return {
			status: false,
			message: "Too many tags"
		};
	}

	return { status: true };
}


export interface IWebContent extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	user: mongoose.Schema.Types.ObjectId,
	webApp: mongoose.Schema.Types.ObjectId,
	name: string,
	connectedWalletRequired: boolean,
	WebContent_responseTo: mongoose.Schema.Types.ObjectId,
	tags: [string],
	likeCount: number,
	liked: boolean,
	visible: boolean,
	cleanJSON: {
		time: number,
		blocks: [
			{
				id: string,
				type: string,
				data: {
					alignment: string,
					caption: string,
					code: string,
					content: [[string]],
					embed: string,
					file: {
						url: string
					},
					height: number,
					html: string,
					items: [string],
					level: number,
					link: string,
					meta: {
						title: string
						site_name: string,
						description: string,
						image: {
							url: string,
						}
					},
					service: string,
					style: string,
					stretched: boolean,
					success: number,
					text: string,
					url: string,
					width: number,
					withBackground: boolean,
					withBorder: boolean,
					withHeadings: boolean,
				},
			}
		],
		version: string
	},
	createdTimeStamp: Date
};


export const WebContentSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	webApp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "WebApp",
		required: true,
	},

	name: {
		type: String,
		default: "",
		maxlength: 3000,
	},

	connectedWalletRequired: {
		type: Boolean,
		default: false
	},

	WebContent_responseTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "WebContent",
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
					default: "",
					maxlength: 3000,
				},

				type: {
					type: String,
					enum: [
						"code",
						"delimiter",
						"embed",
						"header",
						"image",
						"list",
						"paragraph",
						"quote",
						"raw",
						"simpleimage",
						"table"
					],
					maxlength: 3000,
				},
			
				data: {
					alignment: {
						type: String,
						enum: ["center", "left"],
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
							default: "",
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
						enum: ["ordered", "unordered"],
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
});


WebContentSchema.pre("save", function (this: any, next: any) {
	const status = validate({
		cleanJSON: this.cleanJSON,
		tags: this.tags,
	});

	if (status.status == false) { throw `Error: ${status.message}`; }
	
	next();
})

WebContentSchema.pre("validate", function (this: any, next: any) {
	const status = validate({
		cleanJSON: this.cleanJSON,
		tags: this.tags,
	});

	if (status.status == false) { throw `Error: ${status.message}`; }
	
	next();
})

WebContentSchema.pre("updateOne", function (this: any, next: any) {
	const status = validate({
		cleanJSON: this._update.$set.cleanJSON,
		tags: this._update.$set.tags,
	});

	if (status.status == false) { throw `Error: ${status.message}`; }
	
	next();
})


export default mongoose.model<IWebContent>("WebContent", WebContentSchema);