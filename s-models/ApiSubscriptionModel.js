// [REQUIRE]
const mongoose = require("mongoose");


function validate() {
	return {
		status: true
	};
}


const subscription = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
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

	createdAt: {
		type: Date,
		default: Date.now,
	}
});


subscription.pre("updateOne", function (next) {
	const status = validate();

	if (status.status == false) {
		throw status.message;
	}
	
	next();
});


module.exports = mongoose.model("ApiSubscription", subscription);