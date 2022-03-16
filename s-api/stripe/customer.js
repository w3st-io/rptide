// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')
const stripe = require('stripe')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [STRIPE] //
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT] //
const location = '/s-api/stripe/customer'


module.exports = {
	a_createCustomer: async function ({ user_id, email, name }) {
		try {
			// [VALIDATOR] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid user_id',
				}
			}

			// [VALIDATOR] email //
			if (!validator.isAscii(email)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid email',
				}
			}

			// [VALIDATOR] name //
			if (!validator.isAscii(name)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid name',
				}
			}

			const createdStripeCustomer = await Stripe.customers.create({
				email: email,
				name: name,
				metadata: { user_id: `${user_id}` },
			})
	
			return {
				executed: true,
				status: true,
				location: `${location}`,
				createdStripeCustomer: createdStripeCustomer,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}`,
				message: `${location}: Error --> ${err}`,
			}
		}
	},

	
	a_setDefaultPaymentMethod: async function ({ cusId, pmId }) {
		try {
			const stripe_updatedCustomer = await Stripe.customers.update(
				cusId,
				{
					invoice_settings: {
						default_payment_method: pmId,
					}
				}
			)

			return {
				status: true,
				executed: true,
				stripe_updatedCustomer: stripe_updatedCustomer,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}`,
				message: `${location}: Error --> ${err}`,
			}
		}
	},
}