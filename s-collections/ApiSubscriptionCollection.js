// [REQUIRE]
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal
const ApiSubscriptionModel = require('../s-models/ApiSubscriptionModel')


// [INIT]
const location = 'ApiSubscriptionCollection'


module.exports = {
	c_create: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			const createdSubscription = await new ApiSubscriptionModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
			}).save()

			return {
				executed: true,
				status: true,
				location: location,
				createdSubscription: createdSubscription,
				message: 'Successfully created Subscription'
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_read_byUser: async ({ user_id }) => {
		try {
			// [VALIDATE]
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id',
				}
			}

			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: user_id
			})

			return {
				executed: true,
				status: true,
				apiSubscription: apiSubscription
			}

		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	c_update__cusId__user_id: async ({ user_id, cusId }) => {
		try {
			// [VALIDATE] user_id
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			// [VALIDATOR] cusId
			if (!validator.isAscii(cusId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid cusId',
				}
			}

			// [UPDATE] Subscription
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{ user: user_id },
				{
					$set: {
						"stripe.cusId": cusId,
					}
				},
			)

			// [SUCCESS]
			return {
				executed: true,
				status: true,
				updatedApiSubscription: updatedApiSubscription,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},
}