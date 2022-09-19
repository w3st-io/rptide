// [REQUIRE]
const stripe = require("stripe");


// [REQUIRE] Personal
const config = require('../../../s-config');
const UserModel = require('../../../s-models/UserModel');


// [STRIPE]
const Stripe = stripe(config.api.stripe.secretKey);

module.exports = {
	index: async ({ req }) => {
		try {
			const user = await UserModel.findOne({ _id: req.user_decoded._id })
				.select('-password -api.publicKey -api.privateKey')
			
			if (!user) {
				return {
					executed: true,
					status: false,
					message: 'No User Found'
				};
			}

			// [READ][ApiSubscription]
			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: req.user_decoded._id
			});

			if (!apiSubscription) {
				return {
					executed: true,
					status: false,
					message: 'No ApiSubscription found'
				};
			}

			let paymentMethod = {
				card: null
			};

			// [API][stripe] Retrieve payment method details if it exists
			if (apiSubscription.stripe.pmId) {
				paymentMethod = await Stripe.paymentMethods.retrieve(
					apiSubscription.stripe.pmId
				);
			}
			else {
				paymentMethod.card = {
					brand: "",
					last4: "",
					exp_month: null,
					exp_year: null
				};
			}

			// [API][stripe] Retrieve payment method details if it exists
			const tier1StripePrice = await Stripe.prices.retrieve(
				config.api.stripe.priceTier1
			);
			
			// [API][stripe] Retrieve payment method details if it exists
			const tier2StripePrice = await Stripe.prices.retrieve(
				config.api.stripe.priceTier2
			);

			return {
				executed: true,
				status: true,
				user: user,
				paymentMethod: paymentMethod,
				apiSubscription: apiSubscription,
				tier1Price: (tier1StripePrice.unit_amount / 100),
				tier2Price: (tier2StripePrice.unit_amount / 100)
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