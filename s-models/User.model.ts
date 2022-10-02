// [IMPORT]
import mongoose from "mongoose";


// [INIT]
const defaultImage = "https://icon-library.com/images/placeholder-icon/placeholder-icon-17.jpg";


export interface IUser extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	role: string,
	email: string,
	profile: {
		img: string,
		bio: string,
	},
	password: string,
	verified: boolean,
	api: {
		publicKey: string,
		privateKey: string,
	},
	stripe: {
		cusId: string,
		pmId: string,
		subscription: {
			tier1: {
				subId: string,
				cancelAtPeriodEnd: boolean,
			},
			tier2: {
				subId: string,
				cancelAtPeriodEnd: boolean,
			},
		},
		lastChecked: Date
	},
	workspace: {
		webApp: string,
	},
	createdAt: Date,
};

export const UserSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,

	role: {
		type: String,
		enum: ["admin", ""],
		default: "",
		maxlength: 10,
	},

	email: {	
		unique: true,
		type: String,
		required: [true, "This is required"],
		maxlength: 50,
	},
	
	profile: {
		img: {
			type: String,
			default: defaultImage,
			maxlength: 600,
		},

		bio: {
			type: String,
			default: "",
			maxlength: 600,
		},
	},
	
	password: {
		type: String,
		required: [true, "This is required"],
	},

	verified: {
		type: Boolean,
		default: false,
	},
	
	api: {
		publicKey: {
			type: String,
			default: null,
			maxlength: 50,
		},

		privateKey: {
			type: String,
			default: null,
			maxlength: 50,
		},

	},

	stripe: {
		cusId: {
			type: String,
			default: "",
			maxlength: 100
		},

		pmId: {
			type: String,
			default: "",
			maxlength: 100
		},

		subscription: {
			tier1: {
				subId: {
					type: String,
					default: "",
					maxlength: 100
				},

				cancelAtPeriodEnd: {
					type: Boolean,
					default: false,
				},
			},
	
			tier2: {
				subId: {
					type: String,
					default: "",
					maxlength: 100
				},

				cancelAtPeriodEnd: {
					type: Boolean,
					default: false,
				},
			},
		},

		lastChecked: {
			type: Date,
			default: Date.now,
		}
	},

	workspace: {
		webApp: {
			type: String,
			default: "",
			maxlength: 50,
		},
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model<IUser>("User", UserSchema);