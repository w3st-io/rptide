// [REQUIRE]
const stripe = require('stripe')


// [REQUIRE] Personal
const config = require('../../s-config')


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT]
const location = '/s-api/stripe/customer'


module.exports = {
	aa_setDefaultPaymentMethod: async function ({ cusId, pmId }) {
		try {
			const result = await Stripe.customers.update(
				cusId,
				{
					invoice_settings: {
						default_payment_method: pmId,
					}
				}
			)

			// [200] Success
			return {
				status: true,
				executed: true,
				stripe_updatedCustomer: result,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}`,
				message: `Error --> ${err}`,
			}
		}
	},
}