// [REQUIRE]
const mongoose = require("mongoose");


// [INIT]
const defaultImage = "https://icon-library.com/images/placeholder-icon/placeholder-icon-17.jpg";


module.exports = mongoose.model(
	"User",
	mongoose.Schema({
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
		
		profile_img: {
			type: String,
			default: defaultImage,
			maxlength: 600,
		},
		
		password: {
			type: String,
			required: [true, "This is required"],
		},

		bio: {
			type: String,
			default: "",
			maxlength: 600,
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
	})
);