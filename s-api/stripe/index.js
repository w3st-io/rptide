// [REQUIRE]
const stripe = require('stripe')


// [REQUIRE] Personal
const config = require('../../s-config')


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT]
const location = '/s-api/stripe'


module.exports = {
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
				await Stripe.paymentMethods.detach(previous_pmId);
			}
			
			// [API][stripe] Create a paymentMethod
			const stripeCreatedPaymentMethod = await Stripe.paymentMethods.create({
				type: 'card',
				card: {
					number: cardNumber,
					exp_month: cardMonth,
					exp_year: cardYear,
					cvc: cardCvc,
				},
			});
			
	
			// [API][stripe] connect the customer to the paymentMethod
			const attachedPaymentMethod = await Stripe.paymentMethods.attach(
				stripeCreatedPaymentMethod.id,
				{ customer: cusId }
			);
			
			await Stripe.customers.update(
				cusId,
				{
					invoice_settings: {
						default_payment_method: stripeCreatedPaymentMethod.id,
					}
				}
			);

			// [200] Success
			return {
				executed: true,
				status: true,
				stripeCreatedPaymentMethod: stripeCreatedPaymentMethod,
				attachedPaymentMethod: attachedPaymentMethod,
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${err}`,
			};
		}
	},


	// wrapper for changing a paymentMethod for a customer on stripe
	aa_deletePaymentMethod: async function ({ pmId }) {
		try {
			// [API][stripe] Remove previous payment method
			if (pmId !== '') {
				await Stripe.paymentMethods.detach(pmId);
			}
			
			return {
				executed: true,
				status: true,
				message: 'Payment Method Deleted'
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${err}`
			};
		}
	},
}