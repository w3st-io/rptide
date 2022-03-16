// [REQUIRE] Personal //
const api_stripe = require('../../s-api/stripe')
const ApiSubscriptionCollection = require('../../s-collections/ApiSubscriptionCollection')


// [INIT] //
const location = '/s-handler/apiSibscription/paymentMethod'


module.exports = {
	updatePaymentMethod: async ({
		user_id,
		apiSubscription_id,
		cusId,
		previous_pmId,
		cardNumber,
		cardMonth,
		cardYear,
		cardCvc
	}) => {
		try {	
			// [API][stripe] paymentMethod //
			const apiStripe_updatedPM = await api_stripe.aa_updatePaymentMethod({
				cusId,
				previous_pmId,
				cardNumber,
				cardMonth,
				cardYear,
				cardCvc,
			})

			if (apiStripe_updatedPM.status) {
				// [UPDATE][ApiSubscription] update pmId //
				const updatedSubObj = await ApiSubscriptionCollection.c_update_pmId({
					apiSubscription_id,
					user_id,
					pmId: apiStripe_updatedPM.stripeCreatedPaymentMethod.id,
				})

				if (updatedSubObj.status) {
					return {
						executed: true,
						status: true,
						message: '',
						card: apiStripe_updatedPM.stripeCreatedPaymentMethod.card,
					}
				}
				else { return updatedSubObj }
			}
			else { return apiStripe_updatedPM }
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/deletePaymentMethod`,
				message: `${location}/deletePaymentMethod: Error --> ${err}`
			}
		}
	},


	deletePaymentMethod: async ({ user_id, apiSubscription_id, pmId, }) => {
		try {
			// [API][stripe] Remove previous payment method //
			const deleteStripePMObj = await api_stripe.aa_deletePaymentMethod({ pmId })

			if (deleteStripePMObj.status) {
				// [UPDATE][ApiSubscription] pmId //
				const updatedSubObj = await ApiSubscriptionCollection.c_update_pmId({
					user_id,
					apiSubscription_id,
					pmId: '',
				})

				return updatedSubObj
			}
			else { return deleteStripePMObj }
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/deletePaymentMethod`,
				message: `${location}/deletePaymentMethod: Error --> ${err}`
			}
		}
	}
}