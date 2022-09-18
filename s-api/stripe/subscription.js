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
			
			// [API][stripe] Create subscription (Add free trial if exists)
			const subscription = await Stripe.subscriptions.create({
				customer: cusId,
				items: [
					{ price: priceId },
				],
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
}