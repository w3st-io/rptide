// [REQUIRE] Personal //
const api_stripe = require('../../s-api/stripe')
const ApiSubscriptionCollection = require('../../s-collections/ApiSubscriptionCollection')


module.exports = {
	cancel_tier1StripeSub: async ({ user_id, apiSubscription_id, tier1_active }) => {
		// [API][stripe][CANCEL-AEP] tier2 active (If Applicable) //
		const canceledSubObj = await api_stripe.aa_cancelAtEndOfPeriod_subscription_ifApplicable({
			subId: tier1_active,
		})
	
		if (!canceledSubObj.status) { return canceledSubObj }
		
		// [C][ApiSubscription][UPDATE][previousSubIds] Save subId //
		const updatedApiSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_previous({
			apiSubscription_id,
			user_id,
			subId: tier1_active,
		})
		
		if (!updatedApiSubObj.status) { return updatedApiSubObj }
	
		// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier //
		const updatedApiSubObj1 = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier1_active: '',
			stripe_subId_tier1_canceled: tier1_active,
			tier: 0,
		})
	
		if (!updatedApiSubObj1.status) { return updatedApiSubObj1 }
	
		// [SUCCESS] //
		return {
			executed: true,
			status: true,
		}
	},
	
	
	cancel_tier2StripeSub: async ({ user_id, apiSubscription_id, tier2_active }) => {
		// [API][stripe][CANCEL-AEP] tier2 active (If Applicable) //
		const canceledSubObj = await api_stripe.aa_cancelAtEndOfPeriod_subscription_ifApplicable({
			subId: tier2_active,
		})
	
		if (!canceledSubObj.status) { return canceledSubObj }
		
		// [C][ApiSubscription][UPDATE][previousSubIds] Save subId //
		const updatedApiSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_previous({
			apiSubscription_id,
			user_id,
			subId: tier2_active,
		})
		
		if (!updatedApiSubObj.status) { return updatedApiSubObj }
	
		// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier //
		const updatedApiSubObj1 = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier2_active: '',
			stripe_subId_tier2_canceled: tier2_active,
			tier: 0,
		})
	
		if (!updatedApiSubObj1.status) { return updatedApiSubObj1 }
	
		// [SUCCESS] //
		return {
			executed: true,
			status: true,
		}
	},
	

	archive_stripeSub: async ({ user_id, apiSubscription_id, subId }) => {
		// [C][ApiSubscription][UPDATE][previousSubIds] Save subId //
		const updatedApiSubObj = await ApiSubscriptionCollection.c_update__stripe_subId_previous({
			apiSubscription_id,
			user_id,
			subId,
		})
		
		if (!updatedApiSubObj.status) { return updatedApiSubObj }
	
		// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier //
		const updatedApiSubObj1 = await ApiSubscriptionCollection.c_update__stripe_subId_tier1_active__and__stripe_subId_tier1_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier1_active: '',
			stripe_subId_tier1_canceled: '',
			tier: 0,
		})
	
		if (!updatedApiSubObj1.status) { return updatedApiSubObj1 }

		// [C][ApiSubscription][UPDATE] remove active, add canceled, & change tier //
		const updatedApiSubObj2 = await ApiSubscriptionCollection.c_update__stripe_subId_tier2_active__and__stripe_subId_tier2_canceled__and__tier({
			apiSubscription_id,
			user_id,
			stripe_subId_tier2_active: '',
			stripe_subId_tier2_canceled: '',
			tier: 0,
		})
	
		if (!updatedApiSubObj2.status) { return updatedApiSubObj2 }
	
		// [SUCCESS] //
		return {
			executed: true,
			status: true,
		}
	},
}