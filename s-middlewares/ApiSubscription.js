// [REQUIRE]
const config_const = require('../s-config/const');
const ApiSubscriptionModel = require('../s-models/ApiSubscriptionModel');
const ProductModel = require('../s-models/ProductModel');
const ProductOptionModel = require('../s-models/ProductOptionModel');
const WebAppModel = require('../s-models/WebAppModel');
const h_apiSubscription = require('../s-route/api/api-subscription/.handler.js');


// [INIT]
const location = '/s-middleware/Subscription';


module.exports = {
	webAppLimitCheck: function () {
		return async (req, res, next) => {
			// Check apiSubscription status
			await h_apiSubscription.cycleCheckApiSubscription({
				user_id: req.user_decoded._id
			});

			// [INIT]
			let flag = false;

			// [MONGODB][READ][ApiSubscription] Retrieve associated apiSubscription obj
			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: req.user_decoded._id
			});

			const count = await WebAppModel.countDocuments({
				user: req.user_decoded._id
			});

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (!apiSubscription.stripe.subscription.tier1.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (!apiSubscription.stripe.subscription.tier2.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK]
			if (count >= config_const.limit.webApp[2]) {
				flag = true;
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'WebApp limit reached for your subscription, Please upgrade or delete'
				});
			}
			else { next(); }
		}
	},


	productLimitCheck: function () {
		return async (req, res, next) => {
			// Check apiSubscription status
			await h_apiSubscription.cycleCheckApiSubscription({
				user_id: req.user_decoded._id
			});
			
			// [INIT]
			let flag = false

			// [MONGODB][READ][ApiSubscription] Retrieve associated apiSubscription obj
			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: req.user_decoded._id
			});
			
			const count = await ProductModel.countDocuments({
				user: req.user_decoded._id
			});

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (!apiSubscription.stripe.subscription.tier1.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (!apiSubscription.stripe.subscription.tier2.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK]
			if (count >= config_const.limit.webApp[2]) {
				flag = true;
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Product limit reached for your subscription, Please upgrade or delete'
				});
			}
			else { next(); }
		}
	},


	productOptionLimitCheck: function () {
		return async (req, res, next) => {
			// Check apiSubscription status
			await h_apiSubscription.cycleCheckApiSubscription({
				user_id: req.user_decoded._id
			});
			
			// [INIT]
			let flag = false

			// [MONGODB][READ][ApiSubscription] Retrieve associated apiSubscription obj
			const apiSubscription = await ApiSubscriptionModel.findOne({
				user: req.user_decoded._id
			});
			
			const count = await ProductOptionModel.countDocuments({
				user: req.user_decoded._id
			});

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (!apiSubscription.stripe.subscription.tier1.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (!apiSubscription.stripe.subscription.tier2.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK]
			if (count >= config_const.limit.webApp[2]) {
				flag = true;
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'ProductOptions limit reached for your subscription, Please upgrade or delete'
				});
			}
			else { next(); }
		}
	},
}