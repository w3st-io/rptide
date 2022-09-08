// [REQUIRE] Personal //
const api_stripe = require('../../../s-api/stripe');
const api_stripe_price = require('../../../s-api/stripe/price');
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection');
const config = require('../../../s-config');


module.exports = {
	index: async ({ req }) => {
		try {
			const user = await UserModel.findOne({ _id: req.user_decoded._id })
				.select('-password -api.publicKey -api.privateKey')
			
			if (!user) {
				return {
					executed: true,
					status: false,
					message: 'Nothing found'
				};
			}

			// [READ][ApiSubscription] //
			const apiSubscriptionObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			});

			if (!apiSubscriptionObj.status) { return apiSubscriptionObj; }

			// [API][stripe] Retrieve payment method details if it exists //
			const pMObj = await api_stripe.aa_retrieve_ifExistant_paymentMethod({
				pmId: apiSubscriptionObj.apiSubscription.stripe.pmId
			});

			if (!pMObj.status) { return pMObj; }

			// [API][stripe] Retrieve payment method details if it exists //
			const tier1PriceObj = await api_stripe_price.a_retrieve({
				priceId: config.api.stripe.priceTier1
			});

			// [API][stripe] Retrieve payment method details if it exists //
			const tier2PriceObj = await api_stripe_price.a_retrieve({
				priceId: config.api.stripe.priceTier2
			});

			return {
				executed: true,
				status: true,
				user: user,
				paymentMethod: pMObj.paymentMethod,
				apiSubscriptionTier: apiSubscriptionObj.apiSubscription.tier,
				tier1Price: (tier1PriceObj.stripePrice.unit_amount / 100),
				tier2Price: (tier2PriceObj.stripePrice.unit_amount / 100)
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/pages/user',
				message: `/pages/user: Error --> ${err}`,
				err: err
			};
		}
	}
}