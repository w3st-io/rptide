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
			// [VALIDATE] user_id //
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
			// [VALIDATE] //
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
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			// [VALIDATOR] cusId //
			if (!validator.isAscii(cusId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid cusId',
				}
			}

			// [UPDATE] Subscription //
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{ user: user_id },
				{
					$set: {
						"stripe.cusId": cusId,
					}
				},
			)

			// [SUCCESS] //
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


	c_update_pmId: async ({ apiSubscription_id, user_id, pmId }) => {
		try {
			// [VALIDATOR] apiSubscription_id //
			if (!mongoose.isValidObjectId(apiSubscription_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid apiSubscription_id',
				}
			}

			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			// [VALIDATOR] pmId //
			if (pmId) {
				if (!validator.isAscii(pmId)) {
					return {
						executed: true,
						status: false,
						location: location,
						message: 'Invalid pmId',
					}
				}
			}

			// [UPDATE] Subscription //
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{
					_id: apiSubscription_id,
					user: user_id
				},
				{
					$set: {
						"stripe.pmId": pmId,
					}
				},
			)

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


	/******** [SUB_ID] ********/
	c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier: async ({
		apiSubscription_id,
		user_id,
		stripe_subId_tier1_active,
		stripe_subId_tier1_canceled,
		tier,
	}) => {
		try {
			// [VALIDATOR] apiSubscription_id //
			if (!mongoose.isValidObjectId(apiSubscription_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid apiSubscription_id',
				}
			}

			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			// [UPDATE] Subscription //
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{
					_id: apiSubscription_id,
					user: user_id
				},
				{
					$set: {
						"tier": tier,
						"stripe.subId.tier1.active": stripe_subId_tier1_active,
						"stripe.subId.tier1.canceled": stripe_subId_tier1_canceled,
					}
				},
			)

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


	c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier: async ({
		apiSubscription_id,
		user_id,
		stripe_subId_tier2_active,
		stripe_subId_tier2_canceled,
		tier,
	}) => {
		try {
			// [VALIDATOR] apiSubscription_id //
			if (!mongoose.isValidObjectId(apiSubscription_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid apiSubscription_id',
				}
			}

			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			// [UPDATE] apiSubscription //
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{
					_id: apiSubscription_id,
					user: user_id
				},
				{
					$set: {
						"tier": tier,
						"stripe.subId.tier2.active": stripe_subId_tier2_active,
						"stripe.subId.tier2.canceled": stripe_subId_tier2_canceled,
					}
				},
			)

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


	c_update__stripe_subId_previous: async ({ apiSubscription_id, user_id, subId }) => {
		try {
			// [VALIDATOR] apiSubscription_id //
			if (!mongoose.isValidObjectId(apiSubscription_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid apiSubscription_id',
				}
			}

			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id'
				}
			}

			
			// [UPDATE] Subscription //
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{
					_id: apiSubscription_id,
					user: user_id
				},
				{
					$addToSet: { "stripe.subId.previous": subId }
				},
			)

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


	c_reset_lastCleared: async ({ apiSubscription_id, user_id }) => {
		// [UPDATE] Subscription //
		const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
			{
				_id: apiSubscription_id,
				user: user_id
			},
			{
				$set: { "lastCleared": new Date() }
			},
		)
	},
}