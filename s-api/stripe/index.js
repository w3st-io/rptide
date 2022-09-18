// [REQUIRE]
const stripe = require('stripe')


// [REQUIRE] Personal
const a_stripe_customer = require('../../s-api/stripe/customer')
const a_stripe_paymentMethod = require('../../s-api/stripe/paymentMethod')
const a_stripe_subscription = require('../../s-api/stripe/subscription')
const config = require('../../s-config')


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT]
const location = '/s-api/stripe'


module.exports = {
	// Wrapper for creating a customer on stripe
	aa_createCustomer: async function ({ user_id, email, username }) {
		try {
			// [API][stripe] Create a customer
			return await a_stripe_customer.a_createCustomer({
				user_id,
				email: email,
				name: username,
			})
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


	// wrapper for changing a paymentMethod for a customer on stripe
	aa_updatePaymentMethod: async function ({
		cusId,
		previous_pmId,
		cardNumber,
		cardMonth,
		cardYear,
		cardCvc
	}) {
		try {
			// [API][stripe] Remove previous payment method
			if (previous_pmId !== '') {
				await a_stripe_paymentMethod.a_detach({ pmId: previous_pmId })
			}

			// [API][stripe] Create a paymentMethod
			const pMObj = await a_stripe_paymentMethod.a_create({
				cardNumber: cardNumber,
				cardMonth: cardMonth,
				cardYear: cardYear,
				cardCvc: cardCvc,
			})
			
			if (pMObj.status) {
				// [API][stripe] connect the customer to the paymentMethod
				const PMAttachedToCusObj = await a_stripe_paymentMethod.a_attachToCustomer({
					pmId: pMObj.stripeCreatedPaymentMethod.id,
					cusId: cusId
				})
				
				if (PMAttachedToCusObj.status) {
					const cSDPMObj = await a_stripe_customer.aa_setDefaultPaymentMethod({
						cusId: cusId,
						pmId: pMObj.stripeCreatedPaymentMethod.id,
					})

					if (cSDPMObj.status) {
						// [SUCCESS]
						return {
							executed: true,
							status: true,
							stripeCreatedPaymentMethod: pMObj.stripeCreatedPaymentMethod,
							attachedPaymentMethod: PMAttachedToCusObj.attachedPaymentMethod,
						}
					}
					else { return cSDPMObj }
				}
				else { return PMAttachedToCusObj }
			}
			else { return pMObj }
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


	// wrapper for changing a paymentMethod for a customer on stripe
	aa_deletePaymentMethod: async function ({ pmId }) {
		try {
			// [API][stripe] Remove previous payment method
			if (pmId !== '') {
				await a_stripe_paymentMethod.a_detach({ pmId: pmId })
			}
			
			return {
				executed: true,
				status: true,
				message: 'Payment Method Deleted',
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


	// Wrapper for retrieving payment method
	aa_retrieve_ifExistant_paymentMethod: async function ({ pmId }) {
		try {
			if (pmId) {
				// [API][stripe] Retrieve Payment Method Details
				const pmObj = await a_stripe_paymentMethod.a_retrieve({
					pmId: pmId
				})
				
				return pmObj
			}
			else {
				return {
					executed: true,
					status: true,
					paymentMethod: null
				}
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