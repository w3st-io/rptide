// [REQUIRE]
const mongoose = require('mongoose')


function validate() {
	return { status: true }
}


const subscription = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	tier: {
		type: Number,
		required: true,
		maxlength: 1,
		default: 0,
	},

	stripe: {
		cusId: {
			type: String,
			required: false,
			default: '',
		},

		pmId: {
			type: String,
			required: false,
			default: '',
		},

		subId: {
			tier1: {
				active: {
					type: String,
					required: false,
					default: '',
				},
	
				canceled: {
					type: String,
					required: false,
					default: '',
				},
			},
	
			tier2: {
				active: {
					type: String,
					required: false,
					default: '',
				},
	
				canceled: {
					type: String,
					required: false,
					default: '',
				},
			},

			previous: [
				{
					type: String,
					required: false,
					default: '',
				}
			],
		},
	},

	lastCleared: {
		type: Date,
		default: Date.now,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
})


subscription.pre('updateOne', function (next) {
	const status = validate()

	if (status.status == false) { throw status.message }
	
	next()
})


module.exports = mongoose.model('ApiSubscription', subscription)