// [REQUIRE] Personal //
const ApiSubscriptionCollection = require('../../s-collections/ApiSubscriptionCollection')
const a_stripe_subscription = require('../../s-api/stripe/subscription')
const h_stripe_apiSubscription_canceler = require('../../s-handler/apiSubscription/canceler')


module.exports = {
	getSubscriptionTier:async ({ user_id }) => {
		// [INIT] //
		let apiSubscriptionTier = 0

		// [READ][ApiSubscription] //
		const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({ user_id })

		// [ERROR] //
		if (!apiSubObj.status) {
			console.log('/s-handler/apiSubscription Error:', apiSubObj.message)
			return null
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
		// [INIT] //
		let flag = false

		// [READ][ApiSubscription] //
		const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({ user_id })

		// [ERROR] //
		if (!apiSubObj.status) {
			console.log('/s-handler/apiSubscription Error:', apiSubObj.message)
			return
		}

		// [CALCULATE] Hours since last check //
		const hours = Math.abs(apiSubObj.apiSubscription.lastCleared - new Date()) / 36e5
		
		// If last time checked was over 24 hours ago
		if (hours > .5 || force == true) {
			// [TIER-1][ACTIVE] //
			if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
				// [API][subscriptionObj][READ] //
				const subscriptionObj = await a_stripe_subscription.a_getSubscription({
					subId: apiSubObj.apiSubscription.stripe.subId.tier1.active
				})

				if (subscriptionObj.stripeSub.status !== 'active') {
					// set the subscription to canceled.
					await h_stripe_apiSubscription_canceler.archive_stripeSub({
						user_id,
						apiSubscription_id: apiSubObj.apiSubscription._id,
						subId: apiSubObj.apiSubscription.stripe.subId.tier1.active,
					})

					flag = true
				}
			}

			// [TIER-1][CANCELED] //
			if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
				// [API][subscriptionObj][READ] //
				const subscriptionObj = await a_stripe_subscription.a_getSubscription({
					subId: apiSubObj.apiSubscription.stripe.subId.tier1.canceled
				})

				if (subscriptionObj.stripeSub.status !== 'active') {
					// set the subscription to canceled.
					await h_stripe_apiSubscription_canceler.archive_stripeSub({
						user_id,
						apiSubscription_id: apiSubObj.apiSubscription._id,
						subId: apiSubObj.apiSubscription.stripe.subId.tier1.canceled,
					})

					flag = true
				}
			}

			// [TIER-2][ACTIVE] //
			if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
				// [API][subscriptionObj][READ] //
				const subscriptionObj = await a_stripe_subscription.a_getSubscription({
					subId: apiSubObj.apiSubscription.stripe.subId.tier2.active
				})

				if (subscriptionObj.stripeSub.status !== 'active') {
					// set the subscription to canceled.
					await h_stripe_apiSubscription_canceler.archive_stripeSub({
						user_id,
						apiSubscription_id: apiSubObj.apiSubscription._id,
						subId: apiSubObj.apiSubscription.stripe.subId.tier2.active,
					})

					flag = true
				}
			}

			// [TIER-2][CANCELED] //
			if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
				// [API][subscriptionObj][READ] //
				const subscriptionObj = await a_stripe_subscription.a_getSubscription({
					subId: apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				})

				if (subscriptionObj.stripeSub.status !== 'active') {
					// set the subscription to canceled.
					await h_stripe_apiSubscription_canceler.archive_stripeSub({
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

		// Archived subId //
		if (flag == true) {
			console.log('Invalid Subscription Found. Removed from apiSubscription')
		}
		
		return {
			executed: true,
			status: true,
			valid: true,
		}
	},
}