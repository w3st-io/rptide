// [REQUIRE]
const stripe = require('stripe');
const validator = require('validator');


// [REQUIRE] Personal
const a_stripe = require('../../../s-api/stripe');
const config = require('../../../s-config');
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection');
const ApiSubscriptionModel = require('../../../s-models/ApiSubscriptionModel');


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey);


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: '/api-subscription',
	message: ''
};


const tier1PriceId = config.api.stripe.priceTier1;
const tier2PriceId = config.api.stripe.proceTier2;


/**
 * =========
 * = BASIC =
 * =========
 */
async function cycleCheckApiSubscription({ user_id, force = false }) {
	let _returnObj = {
		...returnObj,
		location: 'cycleCheckApiSubscription',
	};

	// [READ][ApiSubscription]
	const apiSubscription = await ApiSubscriptionModel.findOne({
		user: user_id
	});

	// [ERROR]
	if (!apiSubscription) {
		return {
			..._returnObj,
			message: 'No API Subscription found'
		};
	}

	// [CALCULATE] Hours since last check
	const hours = Math.abs(apiSubscription.lastCleared - new Date()) / 36e5;

	// If last time checked was over 24 hours ago
	if (hours > config.cycleHours || force == true) {
		/** TIER 1 **/
		if (apiSubscription.stripe.subscription.tier1.subId) {
			// [API][stripe]
			const stripeSubTier1 = await Stripe.subscriptions.retrieve(
				apiSubscription.stripe.subscription.tier1.subId
			);

			if (stripeSubTier1.status !== "active") {
				// [MONGODB][ApiSubscription]
				await ApiSubscriptionModel.updateOne(
					{
						_id: apiSubscription._id,
						user: user_id
					},
					{
						$set: {
							"stripe.subscription.tier1.subId": "",
							"stripe.subscription.tier1.cancelAtPeriodEnd": false,
							lastChecked: new Date()
						}
					},
				);
			}
		}

		/** TIER 2 **/
		if (apiSubscription.stripe.subscription.tier2.subId) {
			// [API][stripe]
			const stripeSubTier2 = await Stripe.subscriptions.retrieve(
				apiSubscription.stripe.subscription.tier1.subId
			);

			if (stripeSubTier2.status !== "active") {
				// [MONGODB][ApiSubscription]
				await ApiSubscriptionModel.updateOne(
					{
						_id: apiSubscription._id,
						user: user_id
					},
					{
						$set: {
							"stripe.subscription.tier2.subId": "",
							"stripe.subscription.tier2.cancelAtPeriodEnd": false,
							lastChecked: new Date()
						}
					},
				);
			}
		}
	}

	return {
		executed: true,
		status: true,
		valid: true,
	};
}


module.exports = {
	paymentMethod_update: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/payment-method/update',
			message: 'Payment Method successfully changed'
		};

		try {
			if (
				!validator.isAscii(req.body.cardNumber) ||
				!validator.isAscii(req.body.cardMonth) ||
				!validator.isAscii(req.body.cardYear) ||
				!validator.isAscii(req.body.cardCvc)
			) return {
				..._returnObj,
				message: 'Invalid parameters'
			};

			// [READ][ApiSubscription] Get by User
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			});

			// [API][stripe] paymentMethod
			const apiStripe_updatedPM = await a_stripe.aa_updatePaymentMethod({
				cusId: apiSubObj.apiSubscription.stripe.cusId,
				previous_pmId: apiSubObj.apiSubscription.stripe.pmId,
				cardNumber: req.body.cardNumber,
				cardMonth: req.body.cardMonth,
				cardYear: req.body.cardYear,
				cardCvc: req.body.cardCvc
			});

			if (!apiStripe_updatedPM.status) {
				return apiStripe_updatedPM;
			}
			
			// [UPDATE][ApiSubscription] update pmId
			const updatedApiSubscription = await ApiSubscriptionModel.updateOne(
				{
					_id: apiSubscription_id,
					user: user_id
				},
				{
					$set: {
						"stripe.pmId": apiStripe_updatedPM.stripeCreatedPaymentMethod.id,
					}
				},
			);

			// [SUCCESS]
			return {
				..._returnObj,
				status: true,
				card: apiStripe_updatedPM.stripeCreatedPaymentMethod.card,
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `/deletePaymentMethod`,
				message: err
			};
		}
	},


	paymentMethod_delete: async ({ req }) => {
		try {
			// [READ][ApiSubscription] Get by User
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			});

			// [API][stripe] Remove previous payment method
			const deleteStripePMObj = await a_stripe.aa_deletePaymentMethod({
				pmId: apiSubObj.apiSubscription.stripe.pmId
			});

			if (!deleteStripePMObj.status) { return deleteStripePMObj; }

			// [UPDATE][ApiSubscription] pmId
			const updatedSubObj = await ApiSubscriptionCollection.c_update_pmId({
				user_id: req.user_decoded._id,
				apiSubscription_id: apiSubObj.apiSubscription._id,
				pmId: ''
			});

			return updatedSubObj;
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `deletePaymentMethod`,
				message: err
			};
		}
	},


	tier_update: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/tier/update'
		};

		try {
			// [INTERNAL] Force update 
			await cycleCheckApiSubscription({
				user_id: req.user_decoded._id,
				force: true
			})

			// [MONGODB][READ][ApiSubscription] Retrieve associated apiSubscription obj
			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: user_id
			});

			// [ERROR]
			if (!apiSubscription) {
				return {
					..._returnObj,
					message: 'No API Subscription found'
				};
			}

			// [ERROR] Check if payment method exists
			if (!apiSubscription.stripe.pmId) {
				return {
					..._returnObj,
					message: 'No card on file'
				};
			}

			switch (req.body.tier) {
				case '0':
					// [TIER-1][API][stripe] cancel_at_period_end
					await Stripe.subscriptions.update(
						apiSubscription.stripe.susbscription.tier1.subId,
						{ cancel_at_period_end: true }
					);

					// [TIER-2][API][stripe] cancel_at_period_end
					await Stripe.subscriptions.update(
						apiSubscription.stripe.susbscription.tier2.subId,
						{ cancel_at_period_end: true }
					);

					// [MONGODB][apiSubscription] tier
					await ApiSubscriptionModel.updateOne(
						{
							_id: apiSubscription._id,
							user: user_id
						},
						{
							$set: {
								"stripe.subscription.tier2.cancelAtPeriodEnd":
									apiSubscription.stripe.susbscription.tier1.subId? true : false,
								"stripe.subscription.tier2.cancelAtPeriodEnd":
									apiSubscription.stripe.susbscription.tier2.subId? true : false
							}
						},
					);
				break;
					
				case '1':
					// [TIER-2][API][stripe] cancel_at_period_end
					await Stripe.subscriptions.update(
						apiSubscription.stripe.susbscription.tier2.subId,
						{ cancel_at_period_end: true }
					);

					if (apiSubscription.stripe.susbscription.tier1.subId) {
						// [TIER-1][API][stripe] Reactivate
						await Stripe.subscriptions.update(
							apiSubscription.stripe.susbscription.tier1.subId,
							{ cancel_at_period_end: false }
						);
					}
					else {
						// [API][stripe][PURCHASE] tier 1 subscription
						await Stripe.subscriptions.create({
							customer: apiSubscription.stripe.cusId,
							items: [
								{ price: tier1PriceId },
							],
							trial_from_plan: true
						});
						
					}

					// [MONGODB][apiSubscription] tier
					await ApiSubscriptionModel.updateOne(
						{
							_id: apiSubscription._id,
							user: user_id
						},
						{
							$set: {
								"stripe.subscription.tier2.cancelAtPeriodEnd":
									apiSubscription.stripe.susbscription.tier2.subId ? true : false
							}
						},
					);
				break;

				case '2':
					// [TIER-1][API][stripe] cancel_at_period_end
					await Stripe.subscriptions.update(
						apiSubscription.stripe.susbscription.tier1.subId,
						{ cancel_at_period_end: true }
					);

					if (apiSubscription.stripe.susbscription.tier2.subId) {
						// [TIER-1][API][stripe] Reactivate
						await Stripe.subscriptions.update(
							apiSubscription.stripe.susbscription.tier2.subId,
							{ cancel_at_period_end: false }
						);
					}
					else {
						// [API][stripe][PURCHASE] tier 1 subscription
						await Stripe.subscriptions.create({
							customer: apiSubscription.stripe.cusId,
							items: [
								{ price: tier2PriceId },
							],
							trial_from_plan: true
						});
					}

					// [MONGODB][apiSubscription] tier
					await ApiSubscriptionModel.updateOne(
						{
							_id: apiSubscription._id,
							user: user_id
						},
						{
							$set: {
								"stripe.subscription.tier1.cancelAtPeriodEnd":
									apiSubscription.stripe.susbscription.tier1.subId ? true : false
							}
						},
					);
				break;

				default:
					// [ERROR]
					return {
						..._returnObj,
						message: "Invalid tier"
					};
				break;
			}
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err
			};
		}
	},
}