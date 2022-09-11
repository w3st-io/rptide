// [REQUIRE]
const stripe = require('stripe')
const validator = require('validator')


// [REQUIRE] Personal
const config = require('../../s-config')


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT]
const location = '/s-api/stripe/subscription'


module.exports = {
	a_getSubscription: async function ({ subId }) {
		try {
			// [VALIDATOR] subId
			if (!validator.isAscii(subId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid subId',
				}
			}

			const stripeSub = await Stripe.subscriptions.retrieve(subId)

			return {
				executed: true,
				status: true,
				location: location,
				stripeSub: stripeSub
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	a_purchase: async function ({ cusId, priceId }) {
		try {
			// [VALIDATOR] cusId
			if (!validator.isAscii(cusId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid cusId',
				}
			}

			// [VALIDATOR] priceId
			if (!validator.isAscii(priceId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid priceId',
				}
			}
			
			// [API][stripe] Create subscription //
			const subscription = await Stripe.subscriptions.create({
				customer: cusId,
				items: [
					{ price: priceId },
				],
				// Add free trial if exists
				trial_from_plan: true,
			})

			return {
				executed: true,
				status: true,
				subscription: subscription
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	a_list: async function ({ cusId }) {
		try {
			const subscriptions = await Stripe.subscriptions.list({
				customer: cusId,
				limit: 100,
			})

			return {
				executed: true,
				status: true,
				subscriptions: subscriptions.data
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	a_cancel: async function ({ subId }) {
		try {
			// change to update where it ends at the end of the s;lslks
			const subscription_canceled = await Stripe.subscriptions.del(
				subId,
			)

			return {
				executed: true,
				status: true,
				subscription_canceled: subscription_canceled,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	a_cancelAtEndOfPeriod: async function ({ subId }) {
		try {
			const subscription_canceled = await Stripe.subscriptions.update(
				subId,
				{ cancel_at_period_end: true }
			)

			return {
				executed: true,
				status: true,
				subscription_canceled: subscription_canceled,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	a_reactivateSubscription: async function ({ subId, priceId }) {
		try {
			const subscription = await Stripe.subscriptions.retrieve(subId)
	
			const reactivatedSubscription = await Stripe.subscriptions.update(
				subId,
				{
					cancel_at_period_end: false,
					proration_behavior: 'create_prorations',
					items: [
						{
							id: subscription.items.data[0].id,
							price: priceId,
						}
					]
				}
			)

			return {
				executed: true,
				status: true,
				reactivatedSubscription: reactivatedSubscription,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
			}
		}
	},
}