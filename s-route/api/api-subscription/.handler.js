// [REQUIRE]
const stripe = require('stripe')


// [REQUIRE] Personal
const a_stripe = require('../../../s-api/stripe')
const a_stripe_subscription = require('../../../s-api/stripe/subscription')
const config = require('../../../s-config')
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection')


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey)


// [INIT]
const location = '/api-subscription'


const tier1PriceId = config.api.stripe.priceTier1
const tier2PriceId = config.api.stripe.proceTier2


async function cycleCheckApiSubscription({ user_id, force = false }) {
	// [INIT]
	let flag = false

	// [READ][ApiSubscription]
	const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({ user_id })

	// [ERROR]
	if (!apiSubObj.status) {
		console.log('/apiSubscription Error:', apiSubObj.message)
		return
	}

	// [CALCULATE] Hours since last check //
	const hours = Math.abs(apiSubObj.apiSubscription.lastCleared - new Date()) / 36e5

	// If last time checked was over 24 hours ago
	if (hours > .5 || force == true) {
		// [TIER-1][ACTIVE]
		if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubObj.apiSubscription.stripe.subId.tier1.active
			})

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					subId: apiSubObj.apiSubscription.stripe.subId.tier1.active,
				})

				flag = true
			}
		}

		// [TIER-1][CANCELED]
		if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubObj.apiSubscription.stripe.subId.tier1.canceled
			})

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					subId: apiSubObj.apiSubscription.stripe.subId.tier1.canceled,
				})

				flag = true
			}
		}

		// [TIER-2][ACTIVE]
		if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubObj.apiSubscription.stripe.subId.tier2.active
			})

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					subId: apiSubObj.apiSubscription.stripe.subId.tier2.active,
				})

				flag = true
			}
		}

		// [TIER-2][CANCELED]
		if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubObj.apiSubscription.stripe.subId.tier2.canceled
			})

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					subId: apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				})

				flag = true
			}
		}

		await ApiSubscriptionCollection.c_reset_lastCleared({
			user_id,
			apiSubscription_id: apiSubObj.apiSubscription._id,
		})
	}

	// Archived subId
	if (flag == true) {
		console.log('Invalid Subscription Found. Removed from apiSubscription')
	}

	return {
		executed: true,
		status: true,
		valid: true,
	}
}


async function cancel_tier1StripeSub({ user_id, apiSubscription_id, tier1_active }) {
	// [API][stripe][CANCEL-AEP] tier2 active (If Applicable)
	await Stripe.subscriptions.update(tier1_active, { cancel_at_period_end: true })

	// [C][ApiSubscription][UPDATE][previousSubIds] Save subId
	const updatedApiSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_previous({
		apiSubscription_id,
		user_id,
		subId: tier1_active,
	})
	
	if (!updatedApiSubObj.status) { return updatedApiSubObj }

	// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier
	const updatedApiSubObj1 = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
		apiSubscription_id,
		user_id,
		stripe_subId_tier1_active: '',
		stripe_subId_tier1_canceled: tier1_active,
		tier: 0,
	})

	if (!updatedApiSubObj1.status) { return updatedApiSubObj1 }

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		location: location,
		message: 'Successfully canceled tier 1 Stripe subscription',
	}
}


async function cancel_tier2StripeSub({ user_id, apiSubscription_id, tier2_active }) {
	// [API][stripe][CANCEL-AEP] tier2 active (If Applicable)
	await Stripe.subscriptions.update(tier2_active, { cancel_at_period_end: true })
	
	// [C][ApiSubscription][UPDATE][previousSubIds] Save subId
	const updatedApiSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_previous({
		apiSubscription_id,
		user_id,
		subId: tier2_active,
	})
	
	if (!updatedApiSubObj.status) { return updatedApiSubObj }

	// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier
	const updatedApiSubObj1 = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
		apiSubscription_id,
		user_id,
		stripe_subId_tier2_active: '',
		stripe_subId_tier2_canceled: tier2_active,
		tier: 0,
	})

	if (!updatedApiSubObj1.status) { return updatedApiSubObj1 }

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		location: location,
		message: 'Successfully canceled tier 2 Stripe subscription',
	}
}


async function archive_stripeSub ({ user_id, apiSubscription_id, subId }) {
	// [C][ApiSubscription][UPDATE][previousSubIds] Save subId
	const updatedApiSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_previous({
		apiSubscription_id,
		user_id,
		subId,
	})
	
	if (!updatedApiSubObj.status) { return updatedApiSubObj }

	// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier
	const updatedApiSubObj1 = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
		apiSubscription_id,
		user_id,
		stripe_subId_tier1_active: '',
		stripe_subId_tier1_canceled: '',
		tier: 0,
	})

	if (!updatedApiSubObj1.status) { return updatedApiSubObj1 }

	// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier
	const updatedApiSubObj2 = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
		apiSubscription_id,
		user_id,
		stripe_subId_tier2_active: '',
		stripe_subId_tier2_canceled: '',
		tier: 0,
	})

	if (!updatedApiSubObj2.status) { return updatedApiSubObj2 }

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		location: location,
		message: 'Successfully archived Stripe subscription',
	}
}


module.exports = {
	updateTier0: async ([ req ]) => {
		try {
			// [H][apiSubscription] Force update 
			await cycleCheckApiSubscription({
				user_id: req.user_decoded._id,
				force: true,
			})

			// [C][READ][ApiSubscription] Retrieve associated apiSubscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})

			if (apiSubObj.status) { return apiSubObj; }

			if (
				apiSubObj.apiSubscription.stripe.subId.tier1.active ||
				apiSubObj.apiSubscription.stripe.subId.tier1.canceled
			) {
				// [CANCEL] Tier 1 //
				const cancel_tier1StripeSubObj = await cancel_tier1StripeSub({
					user_id: req.user_decoded._id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					tier1_active: apiSubObj.apiSubscription.stripe.subId.tier1.active ||
					apiSubObj.apiSubscription.stripe.subId.tier1.canceled
				})

				// [ERROR]
				if (!cancel_tier1StripeSubObj.status) {
					return cancel_tier1StripeSubObj;
				}

				// [SUCCESS]
				return {
					status: true,
					executed: true,
					message: 'Successfully changed tier'
				}	
			}

			if (
				apiSubObj.apiSubscription.stripe.subId.tier2.active ||
				apiSubObj.apiSubscription.stripe.subId.tier2.canceled
			) {
				await h_apiSub.h_switchTier0FromTier2({
					user_id: req.user_decoded._id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					tier2_active: apiSubObj.apiSubscription.stripe.subId.tier2.active
				})
			}

			// [ERROR]
			return {
				executed: true,
				status: true
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/update-tier-0`,
				message: err
			}
		}
	},


	/*
	* ===================
	* = BASIC FUNCTIONS =
	* ===================
	*/
	getSubscriptionTier:async ({ user_id }) => {
		// [INIT]
		let apiSubscriptionTier = 0

		// [READ][ApiSubscription]
		const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({ user_id })

		// [ERROR]
		if (!apiSubObj.status) {
			console.log('/apiSubscription Error:', apiSubObj.message)
			return
		}

		if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
			apiSubscriptionTier = 1
		}

		if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
			apiSubscriptionTier = 1
		}

		if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
			apiSubscriptionTier = 2
		}

		if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
			apiSubscriptionTier = 2
		}

		return apiSubscriptionTier
	},


	cycleCheckApiSubscription: async ({ user_id, force = false }) => {
		return await cycleCheckApiSubscription({ user_id, force })
	},


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
			// [API][stripe] paymentMethod
			const apiStripe_updatedPM = await a_stripe.aa_updatePaymentMethod({
				cusId,
				previous_pmId,
				cardNumber,
				cardMonth,
				cardYear,
				cardCvc,
			})

			if (!apiStripe_updatedPM.status) { return apiStripe_updatedPM }

			// [UPDATE][ApiSubscription] update pmId
			const updatedSubObj = await ApiSubscriptionCollection.c_update_pmId({
				apiSubscription_id,
				user_id,
				pmId: apiStripe_updatedPM.stripeCreatedPaymentMethod.id,
			})

			if (!updatedSubObj.status) { return updatedSubObj }
			
			return {
				executed: true,
				status: true,
				card: apiStripe_updatedPM.stripeCreatedPaymentMethod.card,
				message: '',
			}
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
			// [API][stripe] Remove previous payment method
			const deleteStripePMObj = await a_stripe.aa_deletePaymentMethod({ pmId })

			if (!deleteStripePMObj.status) { return deleteStripePMObj }

			// [UPDATE][ApiSubscription] pmId
			const updatedSubObj = await ApiSubscriptionCollection.c_update_pmId({
				user_id,
				apiSubscription_id,
				pmId: '',
			})

			return updatedSubObj
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


	/*
	* =================
	* = TIER SWITCHER =
	* =================
	*/
	// [TIER-0] From Tier 1 //
	h_switchTier0FromTier1: async ({ user_id, apiSubscription_id, tier1_active }) => {
		// [CANCEL] Tier 2 //
		const cancel_tier1StripeSubObj = await cancel_tier1StripeSub({
			user_id,
			apiSubscription_id,
			tier1_active,
		})

		// [ERROR]
		if (!cancel_tier1StripeSubObj.status) { return cancel_tier1StripeSubObj }

		// [SUCCESS]
		return {
			status: true,
			executed: true,
			message: 'Successfully changed tier'
		}
	},


	// [TIER-0] From Tier 2 //
	h_switchTier0FromTier2: async ({ user_id, apiSubscription_id, tier2_active }) => {
		// [CANCEL] Tier 2 //
		const cancel_tier2StripeSubObj = await cancel_tier2StripeSub({
			user_id,
			apiSubscription_id,
			tier2_active,
		})

		// [ERROR]
		if (!cancel_tier2StripeSubObj.status) { return cancel_tier2StripeSubObj }

		// [SUCCESS]
		return {
			status: true,
			executed: true,
			message: 'Successfully changed tier'
		}
	},


	// [TIER-1] From Tier 0 //
	h_switchTier1FromTier0: async ({ user_id, apiSubscription_id, cusId, }) => {
		// [INIT]
		let stripe_subId_tier1_active

		// [API][stripe][REACTIVATE] tier 1 (If Existant)
		const reactivatedStripeSubObj = await a_stripe.aa_reactivateSubscription_ifExistant({
			cusId,
			priceId: tier1PriceId
		})

		// [ERROR]
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }

		// [SET] stripe_subId_tier1_active
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier1_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription
			const updatedStripeSubObj = await a_stripe_subscription.a_purchase({
				cusId,
				priceId: tier1PriceId
			})
			
			stripe_subId_tier1_active = updatedStripeSubObj.subscription.id
		}

		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier1_active: stripe_subId_tier1_active,
			stripe_subId_tier1_canceled: '',
			tier: 1,
		})

		// [ERROR]
		if (!updatedSubObj.status) { return updatedSubObj }

		// [SUCCESS]
		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	// [TIER-1] From Tier 2 //
	h_switchTier1FromTier2: async ({ user_id, apiSubscription_id, cusId, tier2_active }) => {
		// [INIT]
		let stripe_subId_tier1_active

		// [CANCEL] Tier 2 //
		const cancel_tier2StripeSubObj = await cancel_tier2StripeSub({
			user_id,
			apiSubscription_id,
			tier2_active,
		})

		// [ERROR]
		if (!cancel_tier2StripeSubObj.status) { return cancel_tier2StripeSubObj }

		// [API][stripe][REACTIVATE] tier 1 (If Existant)
		const reactivatedStripeSubObj = await a_stripe.aa_reactivateSubscription_ifExistant({
			cusId: cusId,
			priceId: tier1PriceId
		})

		// [ERROR]
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }

		// [SET] stripe_subId_tier1_active
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier1_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription
			const updatedStripeSubObj = await a_stripe_subscription.a_purchase({
				cusId: cusId,
				priceId: tier1PriceId
			})
			
			stripe_subId_tier1_active = updatedStripeSubObj.subscription.id
		}

		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier1_active: stripe_subId_tier1_active,
			stripe_subId_tier1_canceled: '',
			tier: 1,
		})

		// [ERROR]
		if (!updatedSubObj.status) { return updatedSubObj }

		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	// [TIER-2] From Tier 0 //
	h_switchTier2FromTier0: async ({ user_id, apiSubscription_id, cusId, }) => {
		// [INIT]
		let stripe_subId_tier2_active

		// [API][stripe][REACTIVATE] tier 2 (If Existant)
		const reactivatedStripeSubObj = await a_stripe.aa_reactivateSubscription_ifExistant({
			cusId: cusId,
			priceId: tier2PriceId
		})

		// [ERROR]
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }
		
		// [SET] stripe_subId_tier2_active
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier2_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription
			const updatedStripeSubObj = await a_stripe_subscription.a_purchase({
				cusId: cusId,
				priceId: tier2PriceId
			})
			
			stripe_subId_tier2_active = updatedStripeSubObj.subscription.id
		}


		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier2_active: stripe_subId_tier2_active,
			stripe_subId_tier2_canceled: '',
			tier: 2,
		})

		// [ERROR]
		if (!updatedSubObj.status) { return updatedSubObj }

		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	// [TIER-2] FROM Tier 1 //
	h_switchTier2FromTier1: async ({ user_id, apiSubscription_id, cusId, tier1_active }) => {
		// [INIT]
		let stripe_subId_tier2_active

		// [CANCEL] Tier 1 //
		const cancel_tier1StripeSubObj = await cancel_tier1StripeSub({
			user_id,
			apiSubscription_id,
			tier1_active,
			tier: 2,
		})

		// [ERROR]
		if (!cancel_tier1StripeSubObj.status) { return cancel_tier1StripeSubObj }

		// [API][stripe][REACTIVATE] tier 1 (If Existant)
		const reactivatedStripeSubObj = await a_stripe.aa_reactivateSubscription_ifExistant({
			cusId: cusId,
			priceId: tier2PriceId
		})

		// [ERROR]
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }

		// [SET] stripe_subId_tier2_active
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier2_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription
			const updatedStripeSubObj = await a_stripe_subscription.a_purchase({
				cusId: cusId,
				priceId: tier2PriceId
			})
			
			stripe_subId_tier2_active = updatedStripeSubObj.subscription.id
		}

		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier2_active: stripe_subId_tier2_active,
			stripe_subId_tier2_canceled: '',
			tier: 2,
		})

		// [ERROR]
		if (!updatedSubObj.status) { return updatedSubObj }

		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	/*
	* ============
	* = CANCELER =
	* ============
	*/
	cancel_tier1StripeSub: async ({ user_id, apiSubscription_id, tier1_active }) => {
		return cancel_tier1StripeSub({ user_id, apiSubscription_id, tier1_active })
	},
	
	
	cancel_tier2StripeSub: async ({ user_id, apiSubscription_id, tier2_active }) => {
		return cancel_tier2StripeSub({ user_id, apiSubscription_id, tier2_active })
	},
	

	archive_stripeSub: async ({ user_id, apiSubscription_id, subId }) => {
		return archive_stripeSub({ user_id, apiSubscription_id, subId })
	},
}