// [REQUIRE] //
const validator = require('validator')
const stripe = require('stripe')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [STRIPE] //
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT] //
const location = '/s-api/stripe/paymentMethod'


module.exports = {
	a_create: async function ({ cardNumber, cardMonth, cardYear, cardCvc }) {
		try {
			// [VALIDATOR] cardNumber //
			if (!validator.isAscii(cardNumber)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid cardNumber',
				}
			}
			
			// [VALIDATOR] cardMonth //
			if (!validator.isAscii(cardMonth)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid cardMonth',
				}
			}
			
			// [VALIDATOR] cardYear //
			if (!validator.isAscii(cardYear)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid cardYear',
				}
			}
			
			const stripeCreatedPaymentMethod = await Stripe.paymentMethods.create({
				type: 'card',
				card: {
					number: cardNumber,
					exp_month: cardMonth,
					exp_year: cardYear,
					cvc: cardCvc,
				},
			})
			
			return {
				executed: true,
				status: true,
				location: location,
				message: 'Succesfully created payment method',
				stripeCreatedPaymentMethod: stripeCreatedPaymentMethod,
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


	a_retrieve: async function ({ pmId }) {
		try {
			const paymentMethod = await Stripe.paymentMethods.retrieve(pmId)

			return {
				executed: true,
				status: true,
				paymentMethod: paymentMethod
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
	
	
	a_detach: async function ({ pmId }) {
		try {
			// [VALIDATOR] pmId //
			if (!validator.isAscii(pmId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid pmId',
				}
			}
			
			// [API][stripe] Detach paymentMethod from customer //
			const detachedPM = await Stripe.paymentMethods.detach(pmId)

			return {
				executed: true,
				status: true,
				detachedPM: detachedPM,
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


	a_attachToCustomer: async function ({ pmId, cusId }) {
		try {
			// [VALIDATOR] pmId //
			if (!validator.isAscii(pmId)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid pmId',
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

			const attachedPaymentMethod = await Stripe.paymentMethods.attach(
				pmId,
				{ customer: cusId }
			)

			return {
				executed: true,
				status: true,
				location: location,
				message: 'Successfully attached payment method to customer',
				attachedPaymentMethod: attachedPaymentMethod
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
