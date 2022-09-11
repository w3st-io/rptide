// [REQUIRE] Personal
const api_stripe_customer = require('../../s-api/stripe/customer')
const api_stripe_paymentMethod = require('../../s-api/stripe/paymentMethod')
const api_stripe_subscription = require('../../s-api/stripe/subscription')


// [INIT]
const location = '/s-api/stripe'


module.exports = {
	// Wrapper for creating a customer on stripe //
	aa_createCustomer: async function ({ user_id, email, username }) {
		try {
			// [API][stripe] Create a customer //
			return await api_stripe_customer.a_createCustomer({
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


	// wrapper for changing a paymentMethod for a customer on stripe //
	aa_updatePaymentMethod: async function ({
		cusId,
		previous_pmId,
		cardNumber,
		cardMonth,
		cardYear,
		cardCvc
	}) {
		try {
			// [API][stripe] Remove previous payment method //
			if (previous_pmId !== '') {
				await api_stripe_paymentMethod.a_detach({ pmId: previous_pmId })
			}

			// [API][stripe] Create a paymentMethod //
			const pMObj = await api_stripe_paymentMethod.a_create({
				cardNumber: cardNumber,
				cardMonth: cardMonth,
				cardYear: cardYear,
				cardCvc: cardCvc,
			})
			
			if (pMObj.status) {
				// [API][stripe] connect the customer to the paymentMethod //
				const PMAttachedToCusObj = await api_stripe_paymentMethod.a_attachToCustomer({
					pmId: pMObj.stripeCreatedPaymentMethod.id,
					cusId: cusId
				})
				
				if (PMAttachedToCusObj.status) {
					const cSDPMObj = await api_stripe_customer.aa_setDefaultPaymentMethod({
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


	// wrapper for changing a paymentMethod for a customer on stripe //
	aa_deletePaymentMethod: async function ({ pmId }) {
		try {
			// [API][stripe] Remove previous payment method //
			if (pmId !== '') {
				await api_stripe_paymentMethod.a_detach({ pmId: pmId })
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


	// Wrapper for canceling subscription //
	aa_cancel_subscription_ifApplicable: async function ({ subId }) {
		try {
			if (subId) {
				const subscription_canceled = await api_stripe_subscription.a_cancel({
					subId,
				})

				return {
					executed: true,
					status: true,
					subscription_canceled: subscription_canceled,
				}
			}

			return {
				executed: true,
				status: true,
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


	// Wrapper for canceling subscription //
	aa_cancelAtEndOfPeriod_subscription_ifApplicable: async function ({ subId }) {
		try {
			if (subId) {
				const subscription_canceled = await api_stripe_subscription.a_cancelAtEndOfPeriod({
					subId,
				})

				return {
					executed: true,
					status: true,
					subscription_canceled: subscription_canceled,
				}
			}

			return {
				executed: true,
				status: true,
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


	// Wrapper for retrieving payment method //
	aa_retrieve_ifExistant_paymentMethod: async function ({ pmId }) {
		try {
			if (pmId) {
				// [API][stripe] Retrieve Payment Method Details //
				const pmObj = await api_stripe_paymentMethod.a_retrieve({
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


	aa_reactivateSubscription_ifExistant: async function ({ cusId, priceId }) {
		try {
			// [INIT]
			let flag = false

			// [API][stripe] Purchase subscription //
			const stripeSubscriptionListObj = await api_stripe_subscription.a_list({
				cusId: cusId,
			})
		
			for (let i = 0; i < stripeSubscriptionListObj.subscriptions.length; i++) {
				const s = stripeSubscriptionListObj.subscriptions[i]

				if (s.plan.id == priceId && flag == false) {
					// Flag found
					flag = true

					// [API][Stripe] Reactivate Subscription //
					const reactivatedSubObj = await api_stripe_subscription.a_reactivateSubscription({
						subId: s.id,
						priceId: priceId
					})

					// [SUCCESS]
					return {
						executed: true,
						status: true,
						message: 'Your previous subscription has been reactivated',
						reactivated: true,
						subscription: reactivatedSubObj.reactivatedSubscription,
					}
				}
			}
				
			return {
				executed: true,
				status: true,
				message: 'No previous subscription found',
				reactivated: false,
				
			}
		}
		catch (err) {
			return {
				executed: true,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`,
				reactivated: false,
			}
		}
	},
}