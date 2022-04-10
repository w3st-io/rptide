// [REQUIRE] Personal //
const api_stripe = require('../../s-api/stripe')
const api_stripe_subscription = require('../../s-api/stripe/subscription')
const ApiSubscriptionCollection = require('../../s-collections/ApiSubscriptionCollection')
const config = require('../../s-config')
const ApiSubscription_canceler = require('./canceler')


// [INIT] //
const tier1PriceId = config.company.products.subscriptions.tier1PriceId
const tier2PriceId = config.company.products.subscriptions.tier2PriceId


module.exports = {
	// [TIER-0] From Tier 1 //
	h_switchTier0FromTier1: async ({ user_id, apiSubscription_id, tier1_active }) => {
		// [CANCEL] Tier 2 //
		const cancel_tier1StripeSubObj = await ApiSubscription_canceler.cancel_tier1StripeSub({
			user_id,
			apiSubscription_id,
			tier1_active,
		})

		// [ERROR] //
		if (!cancel_tier1StripeSubObj.status) { return cancel_tier1StripeSubObj }

		// [SUCCESS] //
		return {
			status: true,
			executed: true,
			message: 'Successfully changed tier'
		}
	},


	// [TIER-0] From Tier 2 //
	h_switchTier0FromTier2: async ({ user_id, apiSubscription_id, tier2_active }) => {
		// [CANCEL] Tier 2 //
		const cancel_tier2StripeSubObj = await ApiSubscription_canceler.cancel_tier2StripeSub({
			user_id,
			apiSubscription_id,
			tier2_active,
		})

		// [ERROR] //
		if (!cancel_tier2StripeSubObj.status) { return cancel_tier2StripeSubObj }

		// [SUCCESS] //
		return {
			status: true,
			executed: true,
			message: 'Successfully changed tier'
		}
	},


	// [TIER-1] From Tier 0 //
	h_switchTier1FromTier0: async ({ user_id, apiSubscription_id, cusId, }) => {
		// [INIT] //
		let stripe_subId_tier1_active

		// [API][stripe][REACTIVATE] tier 1 (If Existant) //
		const reactivatedStripeSubObj = await api_stripe.aa_reactivateSubscription_ifExistant({
			cusId,
			priceId: tier1PriceId
		})

		// [ERROR] //
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }

		// [SET] stripe_subId_tier1_active //
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier1_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription //
			const updatedStripeSubObj = await api_stripe_subscription.a_purchase({
				cusId,
				priceId: tier1PriceId
			})
			
			stripe_subId_tier1_active = updatedStripeSubObj.subscription.id
		}

		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier //
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier1_active: stripe_subId_tier1_active,
			stripe_subId_tier1_canceled: '',
			tier: 1,
		})

		// [ERROR] //
		if (!updatedSubObj.status) { return updatedSubObj }

		// [SUCCESS] //
		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	// [TIER-1] From Tier 2 //
	h_switchTier1FromTier2: async ({ user_id, apiSubscription_id, cusId, tier2_active }) => {
		// [INIT] //
		let stripe_subId_tier1_active

		// [CANCEL] Tier 2 //
		const cancel_tier2StripeSubObj = await ApiSubscription_canceler.cancel_tier2StripeSub({
			user_id,
			apiSubscription_id,
			tier2_active,
		})

		// [ERROR] //
		if (!cancel_tier2StripeSubObj.status) { return cancel_tier2StripeSubObj }

		// [API][stripe][REACTIVATE] tier 1 (If Existant) //
		const reactivatedStripeSubObj = await api_stripe.aa_reactivateSubscription_ifExistant({
			cusId: cusId,
			priceId: tier1PriceId
		})

		// [ERROR] //
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }

		// [SET] stripe_subId_tier1_active //
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier1_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription //
			const updatedStripeSubObj = await api_stripe_subscription.a_purchase({
				cusId: cusId,
				priceId: tier1PriceId
			})
			
			stripe_subId_tier1_active = updatedStripeSubObj.subscription.id
		}

		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier //
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier1_active: stripe_subId_tier1_active,
			stripe_subId_tier1_canceled: '',
			tier: 1,
		})

		// [ERROR] //
		if (!updatedSubObj.status) { return updatedSubObj }

		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	// [TIER-2] From Tier 0 //
	h_switchTier2FromTier0: async ({ user_id, apiSubscription_id, cusId, }) => {
		// [INIT] //
		let stripe_subId_tier2_active

		// [API][stripe][REACTIVATE] tier 2 (If Existant) //
		const reactivatedStripeSubObj = await api_stripe.aa_reactivateSubscription_ifExistant({
			cusId: cusId,
			priceId: tier2PriceId
		})

		// [ERROR] //
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }
		
		// [SET] stripe_subId_tier2_active //
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier2_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription //
			const updatedStripeSubObj = await api_stripe_subscription.a_purchase({
				cusId: cusId,
				priceId: tier2PriceId
			})
			
			stripe_subId_tier2_active = updatedStripeSubObj.subscription.id
		}


		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier //
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier2_active: stripe_subId_tier2_active,
			stripe_subId_tier2_canceled: '',
			tier: 2,
		})

		// [ERROR] //
		if (!updatedSubObj.status) { return updatedSubObj }

		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},


	// [TIER-2] FROM Tier 1 //
	h_switchTier2FromTier1: async ({ user_id, apiSubscription_id, cusId, tier1_active }) => {
		// [INIT] //
		let stripe_subId_tier2_active

		// [CANCEL] Tier 1 //
		const cancel_tier1StripeSubObj = await ApiSubscription_canceler.cancel_tier1StripeSub({
			user_id,
			apiSubscription_id,
			tier1_active,
			tier: 2,
		})

		// [ERROR] //
		if (!cancel_tier1StripeSubObj.status) { return cancel_tier1StripeSubObj }

		// [API][stripe][REACTIVATE] tier 1 (If Existant) //
		const reactivatedStripeSubObj = await api_stripe.aa_reactivateSubscription_ifExistant({
			cusId: cusId,
			priceId: tier2PriceId
		})

		// [ERROR] //
		if (!reactivatedStripeSubObj.status) { return reactivatedStripeSubObj }

		// [SET] stripe_subId_tier2_active //
		if (reactivatedStripeSubObj.reactivated) {
			stripe_subId_tier2_active = reactivatedStripeSubObj.subscription.id
		}
		else {
			// [API][stripe][PURCHASE] subscription //
			const updatedStripeSubObj = await api_stripe_subscription.a_purchase({
				cusId: cusId,
				priceId: tier2PriceId
			})
			
			stripe_subId_tier2_active = updatedStripeSubObj.subscription.id
		}

		// [C][ApiSubscription][UPDATE] add active, remove canceled, & change tier //
		const updatedSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier2_active: stripe_subId_tier2_active,
			stripe_subId_tier2_canceled: '',
			tier: 2,
		})

		// [ERROR] //
		if (!updatedSubObj.status) { return updatedSubObj }

		return {
			executed: true,
			status: true,
			message: 'Successfully Changed API Subscription Tier'
		}
	},
}