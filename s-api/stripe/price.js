// [REQUIRE] //
const validator = require('validator')
const stripe = require('stripe')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [STRIPE] //
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT] //
const location = '/s-api/stripe/price'


module.exports = {
	a_retrieve: async function ({ priceId }) {
		try {
			// [VALIDATOR] priceId //
			if (!validator.isAscii(priceId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid priceId',
				}
			}

			const stripePrice = await Stripe.prices.retrieve(priceId)
			
			return {
				executed: true,
				status: true,
				location: location,
				message: 'Price',
				stripePrice: stripePrice,
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
