// [REQUIRE]
const stripe = require('stripe');
const validator = require('validator');


// [REQUIRE] Personal
const a_stripe = require('../../../s-api/stripe');
const a_stripe_subscription = require('../../../s-api/stripe/subscription');
const config = require('../../../s-config');
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection');
const ApiSubscriptionModel = require('../s-models/ApiSubscriptionModel');


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey);


// [INIT]
const location = '/api-subscription';


const tier1PriceId = config.api.stripe.priceTier1;
const tier2PriceId = config.api.stripe.proceTier2;

/**
 * =========
 * = BASIC =
 * =========
 */
async function cycleCheckApiSubscription({ user_id, force = false }) {
	// [INIT]
	let flag = false;

	// [READ][ApiSubscription]
	const apiSubscription = await ApiSubscriptionModel.findOne({
		user: user_id
	});

	// [ERROR]
	if (!apiSubscription) {
		return {
			executed: true,
			status: false,
			message: 'No API Subscription found'
		};
	}

	// [CALCULATE] Hours since last check
	const hours = Math.abs(apiSubscription.lastCleared - new Date()) / 36e5;

	// If last time checked was over 24 hours ago
	if (hours > .5 || force == true) {
		// [TIER-1][ACTIVE]
		if (apiSubscription.stripe.subId.tier1.active) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubscription.stripe.subId.tier1.active
			});

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubscription._id,
					subId: apiSubscription.stripe.subId.tier1.active,
				});

				await ApiSubscriptionModel.updateOne(
					{
						_id: apiSubscription_id,
						user: user_id
					},
					{
						$addToSet: {
							"stripe.subId.previous": subId
						}
						
					},
				)

				flag = true;
			}
		}

		// [TIER-1][CANCELED]
		if (apiSubscription.stripe.subId.tier1.canceled) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubscription.stripe.subId.tier1.canceled
			});

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubscription._id,
					subId: apiSubscription.stripe.subId.tier1.canceled,
				});

				await ApiSubscriptionModel.updateOne(
					{
						_id: apiSubscription_id,
						user: user_id
					},
					{
						$addToSet: {
							"stripe.subId.previous": subId
						}
						
					},
				)

				flag = true;
			}
		}

		// [TIER-2][ACTIVE]
		if (apiSubscription.stripe.subId.tier2.active) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubscription.stripe.subId.tier2.active
			});

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubscription._id,
					subId: apiSubscription.stripe.subId.tier2.active,
				});

				await ApiSubscriptionModel.updateOne(
					{
						_id: apiSubscription_id,
						user: user_id
					},
					{
						$addToSet: {
							"stripe.subId.previous": subId
						}
						
					},
				)

				flag = true;
			}
		}

		// [TIER-2][CANCELED]
		if (apiSubscription.stripe.subId.tier2.canceled) {
			// [API][subscriptionObj][READ]
			const subscriptionObj = await a_stripe_subscription.a_getSubscription({
				subId: apiSubscription.stripe.subId.tier2.canceled
			});

			if (subscriptionObj.stripeSub.status !== 'active') {
				// set the subscription to canceled.
				await archive_stripeSub({
					user_id,
					apiSubscription_id: apiSubscription._id,
					subId: apiSubscription.stripe.subId.tier2.canceled
				});

				await ApiSubscriptionModel.updateOne(
					{
						_id: apiSubscription._id,
						user: user_id
					},
					{
						$addToSet: {
							"stripe.subId.previous": apiSubscription.stripe.subId.tier2.canceled
						}
						
					},
				)

				flag = true;
			}
		}

		await ApiSubscriptionModel.updateOne(
			{
				_id: apiSubscription._id,
				user: user_id
			},
			{
				$set: { "lastCleared": new Date() }
			},
		);
	}

	// Archived subId
	if (flag == true) {
		console.log('Invalid Subscription Found. Removed from apiSubscription');
	}

	return {
		executed: true,
		status: true,
		valid: true,
	};
}

async function archive_stripeSub({ user_id, apiSubscription_id, subId }) {
	// [C][ApiSubscription][UPDATE][previousSubIds] Save subId
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$addToSet: {
				"stripe.subId.previous": subId
			}
			
		},
	)

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		location: location,
		message: 'Successfully archived Stripe subscription',
	}
}

async function reactivateSubscription_ifExistant() {
	try {
		// [INIT]
		let flag = false

		// [API][stripe] Purchase subscription
		const { data: subscriptions } = await Stripe.subscriptions.list({
			customer: cusId,
			limit: 100,
		})
	
		for (let i = 0; i < subscriptions.length; i++) {
			const s = stripeSubscriptionListObj.subscriptions[i]

			if (s.plan.id == priceId && flag == false) {
				// Flag found
				flag = true

				// [API][Stripe] Reactivate Subscription
				const subscription = await Stripe.subscriptions.retrieve(s.id)

				await Stripe.subscriptions.update(
					s.id,
					{
						cancel_at_period_end: false,
						proration_behavior: 'create_prorations',
						items: [
							{
								id: subscription.items.data[0].id,
								price: priceId,
							}
						]
					}
				)

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
}


/**
 * ============
 * = CANCELER =
 * ============
*/
async function cancel_tier1StripeSub({ user_id, apiSubscription_id, tier1_active }) {
	// [API][stripe][CANCEL-AEP] tier1 active
	await Stripe.subscriptions.update(tier1_active, { cancel_at_period_end: true })

	// [MONGODB][ApiSubscription][UPDATE] remove active, add canceled, store in previous, & change tier
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$set: {
				"tier": 0,
				"stripe.subId.tier1.active": "",
				"stripe.subId.tier1.canceled": tier1_active,
			},
			$addToSet: {
				"stripe.subId.previous": tier1_active
			}
		},
	)

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		location: location,
		message: 'Successfully canceled tier 1 Stripe subscription',
	}
}

async function cancel_tier2StripeSub({ user_id, apiSubscription_id, tier2_active }) {
	// [API][stripe][CANCEL-AEP] tier2 active
	await Stripe.subscriptions.update(tier2_active, { cancel_at_period_end: true })
	
	// [MONGODB][ApiSubscription][UPDATE] remove active, add canceled, & change tier
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$set: {
				"tier": 0,
				"stripe.subId.tier2.active": '',
				"stripe.subId.tier2.canceled": tier2_active,
			},
			$addToSet: {
				"stripe.subId.previous": tier2_active
			}
		},
	)

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		location: location,
		message: 'Successfully canceled tier 2 Stripe subscription',
	}
}


/**
 * =================
 * = TIER SWITCHER =
 * =================
*/
// [TIER-0] From Tier 1
async function h_switchTier0FromTier1({ user_id, apiSubscription_id, tier1_active }) {
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
}

// [TIER-0] From Tier 2
async function h_switchTier0FromTier2({ user_id, apiSubscription_id, tier2_active }) {
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
}

// [TIER-1] From Tier 0
async function h_switchTier1FromTier0({ user_id, apiSubscription_id, cusId }) {
	// [INIT]
	let stripe_subId_tier1_active

	// [API][stripe][REACTIVATE] tier 1 (If Existant)
	const reactivatedStripeSubObj = await reactivateSubscription_ifExistant({
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

	// [MONGODB][ApiSubscription][UPDATE] add active, remove canceled, & change tier
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$set: {
				"tier": 1,
				"stripe.subId.tier1.active": stripe_subId_tier1_active,
				"stripe.subId.tier1.canceled": '',
			}
		},
	);

	// [SUCCESS]
	return {
		executed: true,
		status: true,
		message: 'Successfully Changed API Subscription Tier'
	}
}

// [TIER-1] From Tier 2
async function h_switchTier1FromTier2({ user_id, apiSubscription_id, cusId, tier2_active }) {
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
	const reactivatedStripeSubObj = await reactivateSubscription_ifExistant({
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

	// [MONGODB][ApiSubscription][UPDATE] add active, remove canceled, & change tier
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$set: {
				"tier": 1,
				"stripe.subId.tier1.active": stripe_subId_tier1_active,
				"stripe.subId.tier1.canceled": '',
			}
		},
	)

	return {
		executed: true,
		status: true,
		message: 'Successfully Changed API Subscription Tier'
	}
}

// [TIER-2] From Tier 0
async function h_switchTier2FromTier0({ user_id, apiSubscription_id, cusId, }) {
	// [INIT]
	let stripe_subId_tier2_active

	// [API][stripe][REACTIVATE] tier 2 (If Existant)
	const reactivatedStripeSubObj = await reactivateSubscription_ifExistant({
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


	// [MONGODB][UPDATE][apiSubscription] add active, remove canceled, & change tier
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$set: {
				"tier": 2,
				"stripe.subId.tier2.active": stripe_subId_tier2_active,
				"stripe.subId.tier2.canceled": '',
			}
		},
	)

	return {
		executed: true,
		status: true,
		message: 'Successfully Changed API Subscription Tier'
	}
}

// [TIER-2] FROM Tier 1
async function h_switchTier2FromTier1({ user_id, apiSubscription_id, cusId, tier1_active }) {
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
	const reactivatedStripeSubObj = await reactivateSubscription_ifExistant({
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

	// [MONGODB][ApiSubscription][UPDATE] add active, remove canceled, & change tier
	await ApiSubscriptionModel.updateOne(
		{
			_id: apiSubscription_id,
			user: user_id
		},
		{
			$set: {
				"tier": 2,
				"stripe.subId.tier2.active": stripe_subId_tier2_active,
				"stripe.subId.tier2.canceled": '',
			}
		},
	)

	return {
		executed: true,
		status: true,
		message: 'Successfully Changed API Subscription Tier'
	}
}


module.exports = {
	updateTier0: async ([ req ]) => {
		try {
			// [H][apiSubscription] Force update 
			await cycleCheckApiSubscription({
				user_id: req.user_decoded._id,
				force: true
			})

			// [C][READ][ApiSubscription] Retrieve associated apiSubscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})

			if (apiSubObj.status) { return apiSubObj; }

			// [READ][ApiSubscription]
			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: user_id
			});

			// [ERROR]
			if (!apiSubscription) {
				return {
					executed: true,
					status: false,
					message: 'No API Subscription found'
				};
			}

			if (
				apiSubObj.apiSubscription.stripe.subId.tier1.active ||
				apiSubObj.apiSubscription.stripe.subId.tier1.canceled
			) {
				// [CANCEL] Tier 1 //
				await cancel_tier1StripeSub({
					user_id: req.user_decoded._id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					tier1_active: apiSubObj.apiSubscription.stripe.subId.tier1.active ||
					apiSubObj.apiSubscription.stripe.subId.tier1.canceled
				})
			}

			if (
				apiSubObj.apiSubscription.stripe.subId.tier1.active ||
				apiSubObj.apiSubscription.stripe.subId.tier1.canceled
			) {
				await h_switchTier0FromTier1({
					user_id: req.user_decoded._id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					tier1_active: apiSubObj.apiSubscription.stripe.subId.tier1.active
				})
			}

			if (
				apiSubObj.apiSubscription.stripe.subId.tier2.active ||
				apiSubObj.apiSubscription.stripe.subId.tier2.canceled
			) {
				await h_switchTier0FromTier2({
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


	updateTier1: async ({ req }) => {
		try {
			// [H][apiSubscription] Force update 
			await cycleCheckApiSubscription({
				user_id: req.user_decoded._id,
				force: true,
			})
			
			// [READ][ApiSubscription] Retrieve associated subscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})

			if (!apiSubObj.status) { return apiSubObj; }

			if (!apiSubObj.apiSubscription.stripe.pmId) {
				return {
					executed: true,
					status: false,
					message: 'Attach payment method before changing tier'
				};
			}

			let currentTier = 0

			if (
				apiSubObj.apiSubscription.stripe.subId.tier1.active ||
				apiSubObj.apiSubscription.stripe.subId.tier1.canceled
			) {
				currentTier = 1
			}

			if (
				apiSubObj.apiSubscription.stripe.subId.tier2.active ||
				apiSubObj.apiSubscription.stripe.subId.tier2.canceled
			) {
				currentTier = 2
			}

			// Current Tier
			switch (currentTier) {
				// Previous Tier 0 //
				case 0:
					res.send(
						h_switchTier1FromTier0({
							user_id: req.user_decoded._id,
							apiSubscription_id: apiSubObj.apiSubscription._id,
							cusId: apiSubObj.apiSubscription.stripe.cusId,
						})
					)
				break

				// Previous Tier 2 //
				case 2:
					res.send(
						await h_switchTier1FromTier2({
							user_id: req.user_decoded._id,
							apiSubscription_id: apiSubObj.apiSubscription._id,
							cusId: apiSubObj.apiSubscription.stripe.cusId,
							tier2_active: apiSubObj.apiSubscription.stripe.subId.tier2.active,
						})
					)
				break
			
				default:
					// [ERROR]
					res.send({
						executed: true,
						status: false,
						message: 'Something went wrong'
					})
				break
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/update-tier-1`,
				message: err
			})
		}
	},


	updateTier2: async ({ req }) => {
		try {
			// [H][apiSubscription] Force update 
			await cycleCheckApiSubscription({
				user_id: req.user_decoded._id,
				force: true,
			})

			// [READ][ApiSubscription] Retrieve associated subscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})

			if (apiSubObj.status) {
				if (apiSubObj.apiSubscription.stripe.pmId) {
					let currentTier = 0

					if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
						currentTier = 1
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
						currentTier = 1
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
						currentTier = 2
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
						currentTier = 2
					}

					// Current Tier
					switch (currentTier) {
						// Previous Tier 0 //
						case 0:
							res.send(
								await h_switchTier2FromTier0({
									user_id: req.user_decoded._id,
									apiSubscription_id: apiSubObj.apiSubscription._id,
									cusId: apiSubObj.apiSubscription.stripe.cusId,
								})
							)
						break

						// Previous Tier 1 //
						case 1:
							res.send(
								await h_switchTier2FromTier1({
									user_id: req.user_decoded._id,
									apiSubscription_id: apiSubObj.apiSubscription._id,
									cusId: apiSubObj.apiSubscription.stripe.cusId,
									tier1_active: apiSubObj.apiSubscription.stripe.subId.tier1.active,
								})
							)
						break
					
						default:
							// [ERROR]
							res.send({
								executed: true,
								status: false,
								message: 'Something went wrong'
							})
						break
					}
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: 'Attach payment method before changing tier'
					})
				}
			}
			else { res.send(apiSubObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/update-tier-2`,
				message: `${location}/update-tier-2: Error --> ${err}`
			})
		}
	},


	updatePm: async ({ req }) => {
		try {
			if (
				!validator.isAscii(req.body.cardNumber) ||
				!validator.isAscii(req.body.cardMonth) ||
				!validator.isAscii(req.body.cardYear) ||
				!validator.isAscii(req.body.cardCvc)
			) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid parameters'
				};
			}

			// [READ][ApiSubscription] Get by User
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})

			// [API][stripe] paymentMethod
			const apiStripe_updatedPM = await a_stripe.aa_updatePaymentMethod({
				cusId: apiSubObj.apiSubscription.stripe.cusId,
				previous_pmId: apiSubObj.apiSubscription.stripe.pmId,
				cardNumber: req.body.cardNumber,
				cardMonth: req.body.cardMonth,
				cardYear: req.body.cardYear,
				cardCvc: req.body.cardCvc
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
				message: 'Payment Method successfully changed'
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/deletePaymentMethod`,
				message: err
			}
		}
	},


	deletePm: async ({ req }) => {
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
				location: `${location}/deletePaymentMethod`,
				message: `${location}/deletePaymentMethod: Error --> ${err}`
			};
		}
	},
}